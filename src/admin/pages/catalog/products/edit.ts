import angular from 'angular';
import { tinymceOptions } from '../../../data/tinymceOptions';
import template from './edit.template.html';
import { Product } from '../../../features/catalog/products/product';
import uomOptions from '../../../data/uomOptions.json';
import type { Localized } from '../../../types';
import { stringify } from '../../../utils/stringify';
import { convertIntToBoolean } from '../../../utils/convertIntToBoolean';

declare const localized: Localized;

export const ProductEdit: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$scope',
	'$stateParams',
	'Admin',
	'Debug',
	'Utils',
	'Products',
	'SearchModal',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Debug: any,
	Utils: any,
	Products: any,
	SearchModal: any
) {
	this.stringify = stringify;
	this.uomOptions = uomOptions;
	this.tinymceOptions = tinymceOptions;
	this.priceMinimum = 0.01;
	this.priceLimit = 999999.99;
	this.breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-catalog' },
		{
			label: 'Products',
			href: '?page=vf-catalog#/products',
		},
		{
			label: 'Edit product',
		},
	];

	this.searchOptions = {
		product_id: 'ID',
		description: 'Name',
		sku: 'SKU',
	};

	this.id = $stateParams.id;

	this.$onInit = () => {
		this.productSlug =
			localized.settings.general.product_slug || 'products';
		$scope.attributesLength = 36;
		$scope.isAuthed = Admin.Authed();
		$scope.loading = true;
		$scope.loadingMore = false;
		$scope.maxAttributes = 18;
		$scope.myFile = {};
		this.product = new Product();
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
		$scope.scrollSlides = 0;
		$scope.savingNote = false;
		$scope.searchModalPage = '';
		$scope.searchTerm = '';
		$scope.slides = 0;

		this.searchParams = {
			page: 1,
			rpp: $scope.rppValues[0], // Must define after rppValues is declared.
		};

		this.getProduct();
	};

	this.getProduct = () => {
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		let req = {
			method: 'GET',
			url: $scope.productEndpoint,
		} as any;

		let done = 0,
			total = 2;
		req.url += this.id;
		Utils.getHttpPromise(req)
			.then(
				(response: any) => {
					this.product = response.product;
					this.product.ignore_inventory = convertIntToBoolean(
						this.product.ignore_inventory
					);

					$scope.numAttributes = [];
					for (let i = 1; i <= 18; i++) {
						if (
							this.product['att' + i + 'n'] ||
							this.product['att' + i + 'd']
						) {
							$scope.numAttributes.push(i);
						}
					}

					if (!this.product.meta) {
						this.product.meta = {};
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				if (++done >= total) {
					$scope.loading = false;
				}
			});
		req = {
			method: 'GET',
			url: localized.apiURL + '/admin/product/note',
			params: {
				product_id: this.id,
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
				if (++done >= total) {
					$scope.loading = false;
				}
			});
	};

	// Handle changes passed up from child component.
	this.handleChange = (key: string, value: unknown) => {
		this.product[key] = value;
	};

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
					fields: [
						'id',
						'title',
						'length',
						'width',
						'height',
						'distance_unit',
					],
					fieldPrefixes: [
						'ID: ',
						'',
						'Length: ',
						'Width: ',
						'Height: ',
						'Unit: ',
					],
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
		this.product.pricesheets[i].deleted = true;
	};

	this.searchCancelled = () => {
		angular.noop();
	};

	this.searchResults = (resp: any) => {
		switch ($scope.searchModalPage) {
			case 'mfg':
				this.product.manufacturer_id = resp[0].value.id;
				this.product.manufacturer = resp[0].value;
				break;
			case 'cat':
				this.product.category_id = resp[0].value.cat_id;
				this.product.category = resp[0].value;
				break;
			case 'ps':
				for (let q = 0; q < resp.length; q++) {
					let skip3 = false;
					for (let r = 0; r < this.product.pricesheets.length; r++) {
						if (
							resp[q].value.price_sheet_id ===
							this.product.pricesheets[r].price_sheet_id
						) {
							skip3 = true;
							this.product.pricesheets[r].deleted = false;
							this.product.pricesheets[r].price = 0.0;
							break;
						}
					}
					if (!skip3) {
						this.product.pricesheets.push({
							pricesheetindex: resp[q].value,
							ps_item_id: 0,
							price_sheet_id: resp[q].value.price_sheet_id,
							price: 0,
							product_id: this.product.product_id,
							sku: this.product.sku,
						});
					}
				}
				break;
			case 'parcel':
				for (let t = 0; t < resp.length; t++) {
					let skip4 = false;
					for (let y = 0; y < this.product.parcels.length; y++) {
						if (resp[t].value.id === this.product.parcels[y].id) {
							skip4 = true;
							break;
						}
					}
					if (!skip4) {
						this.product.parcels.push(resp[t].value);
						this.product.parcels[
							this.product.parcels.length - 1
						].pivot = {
							parcel_id: resp[t].value.id,
							product_id: this.product.product_id,
							weight: '',
							mass_unit: '',
						};
					}
				}
				break;
		}
	};

	function syncProductPosts(id: number) {
		const url = `${location.origin}/wp-json/vendorfuel/syncProductPosts?id=${id}`;
		return $http.get(url);
	}

	this.updateProduct = () => {
		$scope.loading = true;
		const req = {
			method: 'PUT',
			url: $scope.productEndpoint + this.product.product_id,
			data: this.product,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					syncProductPosts(this.product.product_id).then(() => {
						$scope.loading = false;
					});
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	this.LoadNotes = () => {
		const req = {
			method: 'GET',
			url: localized.apiURL + '/admin/product/note',
			params: {
				product_id: this.product.product_id,
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
		$scope.noteParams.product_id = this.product.product_id;
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
