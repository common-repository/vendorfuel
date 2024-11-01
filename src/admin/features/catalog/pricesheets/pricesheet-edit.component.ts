import { Pricesheet } from './pricesheet';
import template from './pricesheet-edit.component.html';
export const PricesheetEdit: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$scope',
	'$stateParams',
	'Admin',
	'Debug',
	'PriceSheets',
	'SearchModal',
	'Utils',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Debug: any,
	PriceSheets: any,
	SearchModal: any,
	Utils: any
) {
	const initialBreadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-catalog' },
		{
			label: 'Price Sheets',
			href: '?page=vf-catalog#/pricesheets',
		},
	];
	this.breadcrumbs = initialBreadcrumbs;

	this.tabs = [
		{ label: 'General', id: 'general' },
		{ label: 'Products', id: 'products' },
	];
	this.active = this.tabs[0].id;
	this.setActive = (id: string) => {
		this.active = id;
	};

	this.resetTransactionType = () => {
		this.pricesheet.transaction_type = null;
	};

	$scope.addParams = {
		products: [],
	};
	$scope.editIndex = -1;
	$scope.isAuthed = Admin.Authed();
	$scope.loading = true;
	$scope.loadingMore = false;
	$scope.myFile = {};
	$scope.object = Object;
	$scope.pricesheetEndpoint = localized.apiURL + '/admin/pricesheets/';
	$scope.productEndpoint = localized.apiURL + '/admin/products/';
	$scope.productsLoading = false;
	this.pricesheet = null;
	$scope.searchTerm = '';
	this.isShowingChanges = false;
	this.updatedProducts = [];
	this.perPageOptions = [15, 30, 50, 100];
	this.searchOptions = {
		price_sheet_id: 'ID',
		sheet: 'Price Sheet',
		site_id: 'Site ID',
		gp_price_sheet: 'GP Price Sheet',
	};
	$scope.searchParams = {
		perPage: this.perPageOptions[0], // Must be defined after rppValues is declared.
	};

	this.allPrShSearchParams = {
		page: 1,
		q: '',
		searchBy: '',
		orderBy: '',
		direction: '',
		perPage: this.perPageOptions[0], // Must be defined after rppValues is declared.
	};
	this.sortAscending = true;
	this.id = parseInt($stateParams.id);

	this.$onInit = () => {
		this.show();
	};

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};
	$scope.SearchResults = (resp: any) => {
		const currentIds = this.updatedProducts.map(
			(item: any) => item.value.product_id
		);
		this.updatedProducts = [];
		resp.forEach((item: any) => {
			const included = currentIds.includes(item.value.product_id);
			if (item.action === 'add') {
				this.updatedProducts.push({
					action: 'add',
					value: {
						product_id: item.value.product_id,
						sku: item.value.sku,
						price: included ? item.value.price : 0.0,
						product: included ? item.value.product : item.value,
					},
				});
			} else if (item.action === 'remove') {
				this.updatedProducts.push(item);
			}
		});
	};

	function modifiedProduct(product: {
		action: 'add' | 'remove';
		value: { price: number; product_id: number };
	}): {
		product_id: number;
		price?: number;
		deleted?: boolean;
	} {
		if (product.action !== 'remove') {
			return {
				product_id: product.value.product_id,
				price: product.value.price,
			};
		}
		return {
			product_id: product.value.product_id,
			deleted: true,
		};
	}

	this.handleRemoveProduct = (productId: number) => {
		this.isBusy = true;

		const url = `${localized.apiURL.replace(
			'v1',
			'v2'
		)}/admin/pricesheets/${this.id}`;

		const data = {
			products: [{ product_id: productId, deleted: true }],
		};

		$http
			.patch(url, data)
			.then((response) => response.data)
			.then(() => {
				this.show();
			});
	};

	this.update = (id: number) => {
		this.isBusy = true;

		const url = `${localized.apiURL.replace(
			'v1',
			'v2'
		)}/admin/pricesheets/${id}`;

		const data: Pricesheet = {
			sheet: this.pricesheet.sheet,
			site_id: this.pricesheet.site_id,
			gp_price_sheet: this.pricesheet.gp_price_sheet,
			default_price_sheet: this.pricesheet.default_price_sheet,
			transaction_type: this.pricesheet.transaction_type,
			clearSaleDisabled: this.pricesheet.clearSaleDisabled,
			products: [],
		};

		if (this.updatedProducts.length) {
			data.products = this.updatedProducts.map((product) => {
				return modifiedProduct(product);
			});
		}

		$http
			.put(url, data)
			.then((response) => response.data)
			.then(() => {
				this.updatedProducts = [];
				this.isShowingChanges = false;
				this.show();
			});
	};

	/**
	 * @param {number} id Price sheet ID
	 */
	this.deletePricesheet = (id: number) => {
		this.isDeleting = true;
		PriceSheets.deletePriceSheet(id).then(() => {
			this.isDeleting = false;
			this.isConfirmingDeletion = false;
			this.pricesheet = null;
		});
	};

	$scope.editParams = (pricesheetItem: any) => {
		for (let i = 0; i < this.updatedProducts.length; i++) {
			if (
				this.updatedProducts[i].value.product_id ===
				pricesheetItem.product_id
			) {
				if (this.updatedProducts[i].action === 'remove') {
					return;
				}
				this.updatedProducts[i].value.price = pricesheetItem.price;
				return;
			}
		}
		this.updatedProducts.push({
			action: 'edited',
			value: pricesheetItem,
		});
	};
	$scope.EditPrice = (index: number) => {
		$scope.editIndex = index;
	};

	$scope.SearchCancelled = () => {};

	$scope.SearchPricesheet = (page: number) => {
		this.isBusy = true;
		$scope.productsLoading = true;
		$scope.searchParams.page = page || 1;
		const req = {
			method: 'GET',
			url: $scope.pricesheetEndpoint + this.pricesheet.price_sheet_id,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					this.pricesheet = resp.pricesheet;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.productsLoading = false;
				this.isBusy = false;
			});
	};

	this.handlePageChange = (page: number) => {
		$scope.SearchPricesheet(page);
	};

	this.searchPricesheets = () => {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: $scope.pricesheetEndpoint,
			params: this.allPrShSearchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.pricesheets = resp.pricesheets;
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
		this.allPrShSearchParams.page = page;
		this.searchPricesheets();
	};

	this.setRpp = (perPage: number) => {
		this.allPrShSearchParams.perPage = perPage;
		this.searchPricesheets();
	};

	this.setQuery = (query: string, searchBy: string) => {
		this.allPrShSearchParams.page = 1; // Reset page when query changes.
		this.allPrShSearchParams.q = query;
		this.allPrShSearchParams.searchBy = searchBy;
		$scope.searchTerm = this.allPrShSearchParams.q;
		$scope.searchedBy = this.allPrShSearchParams.searchBy;
		this.searchPricesheets();
	};

	this.changeSortBy = (orderBy: string, e: Event) => {
		e.preventDefault();
		this.sortAscending =
			this.allPrShSearchParams.orderBy === orderBy
				? !this.sortAscending
				: true;
		this.allPrShSearchParams.orderBy = orderBy;
		this.allPrShSearchParams.direction = this.sortAscending
			? 'asc'
			: 'desc';
		this.searchPricesheets();
	};

	this.show = () => {
		this.isBusy = true;
		const url = `${localized.apiURL.replace(
			'v1',
			'v2'
		)}/admin/pricesheets/${this.id}`;
		const config = {
			params: {
				perPage: this.perPageOptions[0],
			},
		};
		$http
			.get(url, config)
			.then((response) => {
				this.pricesheet = response.data.pricesheet;
				this.breadcrumbs = [
					...initialBreadcrumbs,
					{
						label: response.data.pricesheet.sheet,
						href: `?page=vendorfuel#!/catalog/pricesheets/${this.id}`,
					},
				];
			})
			.catch((error) => {
				Debug.error(error);
			})
			.finally(() => {
				this.isBusy = false;
			});
	};

	$scope.OpenSearchModalAdd = () => {
		let callback = {};
		const config = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.productEndpoint,
						params: {
							q: '',
						},
					},
					relationships: ['products'],
					fields: ['sku', 'image', 'description', 'status'],
					fieldPrefixes: ['', '', '', 'Status: '],
					id: 'product_id',
					selectOne: false,
				},
			],
			updatedItems: $scope.addParams.products,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			$scope.addParams.name || 'New Price Sheet',
			config,
			'Add items'
		);
	};
	$scope.OpenSearchModalUpdate = () => {
		let callback = {};
		const config = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.productEndpoint,
						params: {
							q: '',
							excludedField: 'price_sheet_id',
							excludedId: this.pricesheet.price_sheet_id,
							excludedTable: 'price_sheets',
						},
					},
					relationships: ['products'],
					fields: ['sku', 'image', 'description', 'status'],
					fieldPrefixes: ['', '', '', 'Status: '],
					id: 'product_id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url:
							$scope.pricesheetEndpoint +
							this.pricesheet.price_sheet_id,
						params: {
							q: '',
						},
					},
					relationships: ['pricesheet', 'pricesheetItems', 'product'],
					fields: ['sku', 'image', 'description', 'price'],
					fieldPrefixes: ['', '', '', 'Price: '],
					id: 'product_id',
				},
			],
			updatedItems: this.updatedProducts,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(callback, this.pricesheet.sheet, config, 'Add items');
	};
	$scope.OpenSearchModalPricesheet = () => {
		let callback = {};
		const config = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.pricesheetEndpoint,
						params: {
							q: '',
						},
					},
					relationships: ['pricesheets'],
					fields: ['price_sheet_id', 'sheet'],
					fieldPrefixes: ['ID: ', ''],
					id: 'price_sheet_id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			'Select Price Sheet',
			config,
			'Add Price Sheet'
		);
	};
}
