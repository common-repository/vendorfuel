import angular from 'angular';
import template from './create.template.html';
import { tinymceOptions } from '../../../data/tinymceOptions';
import { Product } from '../../../catalog/products/Product';
import { Document } from '../../../shared/Document';
import uomOptions from '../../../data/uomOptions.json';
import type { Localized } from '../../../types';
import { stringify } from '../../../utils/stringify';

declare const localized: Localized;
declare const wp: any;

export const ProductCreate: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$scope',
	'$state',
	'$stateParams',
	'Debug',
	'Utils',
	'Products',
	'SearchModal',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Debug: any,
	Utils: any,
	Products: any,
	SearchModal: any
) {
	this.stringify = stringify;
	this.uomOptions = uomOptions;
	this.placeholderImg = `${localized.dir.url}assets/img/placeholder-150px.png`;
	this.tinymceOptions = tinymceOptions;
	this.priceMinimum = 0.01;
	this.priceLimit = 999999.99;

	this.searchOptions = {
		product_id: 'ID',
		description: 'Name',
		sku: 'SKU',
	};
	this.productSlug = localized.settings.general.product_slug || 'products';
	this.breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-catalog' },
		{ label: 'Products', href: '?page=vf-catalog#/products' },
		{
			label: 'Add new',
			href: '?page=vendorfuel#!/catalog/products/create',
		},
	];
	$scope.maxAttributes = 18;
	this.product = new Product();
	$scope.myFile = {};
	$scope.noteParams = {
		note: '',
	};
	$scope.numAttributes = [];
	$scope.parcelWeightUnits = {
		lb: 'Pounds',
		kg: 'Kilograms',
	};
	$scope.productEndpoint = localized.apiURL + '/admin/products/';
	$scope.productNotes = [];
	$scope.products = [];
	$scope.productsFactory = Products;
	$scope.regValues = [
		{ key: '1', value: 'Yes' },
		{ key: '0', value: 'No' },
	];
	$scope.rppValues = [15, 30, 50, 100];
	$scope.saved = false;
	$scope.saving = false;
	$scope.savingNote = false;
	$scope.searchModalPage = '';
	$scope.searchTerm = '';
	$scope.selectedProduct = $stateParams.product || null;

	this.searchParams = {
		page: 1,
		rpp: $scope.rppValues[0], // Must define after rppValues is declared.
	};

	$scope.saving = false;
	$scope.saved = false;
	$scope.cancelled = false;

	this.$onInit = () => {
		this.getShippingMode();
	};

	this.getShippingMode = (): void => {
		const url = `${localized.apiURL.replace(
			'v1',
			'v2'
		)}/admin/shipping/mode`;

		$http
			.get(url)
			.then((response) => response.data)
			.then((responseData: { mode: string }) => {
				this.hasParcelShippingMode = responseData.mode === 'parcel';
			});
	};

	// Handle changes passed up from child component.
	this.handleChange = (key: string, value: unknown) => {
		this.product[key] = value;
	};

	/*
	 * Attributes
	 */
	this.addAttribute = () => {
		if ($scope.numAttributes.length >= $scope.maxAttributes) {
			return;
		}
		let i = 1;
		while ($scope.numAttributes.indexOf(i) !== -1) {
			i++;
		}
		$scope.numAttributes.push(i);
	};

	this.removeAttribute = (i: number) => {
		$scope.numAttributes.splice(i - 1, 1);
		this.product['att' + i + 'n'] = '';
		this.product['att' + i + 'd'] = '';
	};

	this.searchProducts = () => {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: $scope.productEndpoint,
			params: this.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.products = resp.products;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loadingMore = false;
			});
	};

	this.setPage = (page: number) => {
		this.searchParams.page = page;
		this.searchProducts();
	};

	this.setRpp = (rpp: number) => {
		this.searchParams.rpp = rpp;
		this.searchProducts();
	};

	this.setQuery = (query: string, searchBy: string) => {
		this.searchParams.page = 1; // Reset page when query changes.
		this.searchParams.q = query;
		this.searchParams.searchBy = searchBy;
		$scope.searchTerm = this.searchParams.q;
		this.searchedBy = this.searchParams.searchBy;
		this.searchProducts();
	};

	function syncProductPosts(id: number) {
		const url = `${location.origin}/wp-json/vendorfuel/syncProductPosts?id=${id}`;
		return $http.get(url);
	}

	this.addProduct = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.productEndpoint,
			data: this.product,
		};
		Utils.getHttpPromise(req)
			.then(
				(response: any) => {
					if (!response.errors.length) {
						$scope.selectedProduct = {
							product_id: response.product_id,
						};
						$state.go('catalog.products.edit', {
							id: response.product_id,
						});

						this.product = new Product();

						syncProductPosts(response.product_id).then(() => {
							$scope.loading = false;
						});
					}
				},
				(errResp: Error) => {
					Debug.log(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	this.openCatSearch = () => {
		$scope.searchModalPage = 'cat';
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/category/',
						params: {
							q: '',
						},
					},
					relationships: ['categories'],
					fields: ['cat_id', 'title', 'parent_id'],
					fieldPrefixes: ['ID: ', '', 'Parent ID: '],
					id: 'cat_id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(callback, 'Categories', data, 'Add items');
	};

	this.openMfgSearch = () => {
		$scope.searchModalPage = 'mfg';
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/manufacturers/',
						params: {
							q: '',
						},
					},
					relationships: ['manufacturers'],
					fields: ['id', 'manufacturer', 'info', 'website'],
					fieldPrefixes: ['', '', 'Info: ', 'Website: '],
					id: 'id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(callback, 'Manufacturers', data, 'Add items');
	};

	this.openPsSearch = () => {
		$scope.searchModalPage = 'ps';
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/pricesheets/',
						params: {
							q: '',
						},
					},
					relationships: ['pricesheets'],
					fields: ['price_sheet_id', 'sheet'],
					fieldPrefixes: ['ID: ', ''],
					id: 'price_sheet_id',
					selectOne: false,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(callback, 'Price Sheets', data, 'Add items');
	};

	this.openParcelSearch = () => {
		$scope.searchModalPage = 'parcel';
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/shipping/parcel/',
						params: {
							q: '',
						},
					},
					relationships: ['parcels'],
					fields: ['id', 'title'],
					fieldPrefixes: ['ID: ', ''],
					id: 'id',
					selectOne: false,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(callback, 'Parcels', data, 'Add items');
	};

	this.removeParcel = (i: number) => {
		this.product.parcels.splice(i, 1);
	};

	this.removePricesheet = (i: number) => {
		this.product.pricesheets.splice(i, 1);
	};

	this.searchCancelled = () => {
		angular.noop();
	};

	this.searchResults = (resp: any) => {
		switch ($scope.searchModalPage) {
			case 'mfg':
				this.product.manufacturer_id = resp[0].value.id;
				this.product.manufacturer = resp[0].value.name;
				break;
			case 'cat':
				this.product.category_id = resp[0].value.cat_id;
				this.product.category = resp[0].value;
				break;
			case 'ps':
				for (let i = 0; i < resp.length; i++) {
					let skip = false;
					for (let j = 0; j < this.product.pricesheets.length; j++) {
						if (
							resp[i].value.price_sheet_id ===
							this.product.pricesheets[j].price_sheet_id
						) {
							skip = true;
							break;
						}
					}
					if (!skip) {
						this.product.pricesheets.push({
							pricesheetindex: resp[i].value,
							ps_item_id: 0,
							price_sheet_id: resp[i].value.price_sheet_id,
							price: 0,
						});
					}
				}
				break;
			case 'parcel':
				for (let k = 0; k < resp.length; k++) {
					let skip2 = false;
					for (let l = 0; l < this.product.parcels.length; l++) {
						if (resp[k].value.id === this.product.parcels[l].id) {
							skip2 = true;
							break;
						}
					}
					if (!skip2) {
						this.product.parcels.push(resp[k].value);
						this.product.parcels[
							this.product.parcels.length - 1
						].pivot = {
							parcel_id: resp[k].value.id,
							weight: '',
							mass_unit: '',
						};
					}
				}
				break;
		}
	};

	this.LoadNotes = () => {
		const req = {
			method: 'GET',
			url: localized.apiURL + '/admin/product/note',
			params: {
				product_id: $scope.selectedProduct.product_id,
			},
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.productNotes = resp.notes;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.savingNote = false;
			});
	};

	this.saveNote = () => {
		$scope.savingNote = true;
		$scope.noteParams.product_id = $scope.selectedProduct.product_id;
		const req = {
			method: 'POST',
			url: localized.apiURL + '/admin/product/note/',
			data: $scope.noteParams,
		};
		Utils.getHttpPromise(req).then(
			() => {
				this.LoadNotes();
				$scope.noteParams.note = '';
			},
			(errResp: Error) => {
				Debug.error(errResp);
			}
		);
	};

	this.deleteNote = (id: number) => {
		$scope.savingNote = true;
		const req = {
			method: 'DELETE',
			url: localized.apiURL + '/admin/product/note/' + id,
		};
		Utils.getHttpPromise(req).then(
			() => {
				this.LoadNotes();
			},
			(errResp: Error) => {
				Debug.error(errResp);
			}
		);
	};

	this.addDocument = () => {
		this.product.documents.push(new Document());
	};

	this.deleteDocument = (index: number) => {
		this.product.documents.splice(index, 1);
	};
}
