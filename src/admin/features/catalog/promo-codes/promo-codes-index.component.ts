import template from './promo-codes-index.component.html';

export const PromoCodesIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'$stateParams',
	'Admin',
	'Debug',
	'Utils',
	'SearchModal',
	'PromoCodesService',
];

function controller(
	$scope: ng.IScope,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Debug: any,
	Utils: any,
	SearchModal: any,
	PromoCodesService: any
) {
	this.$onInit = () => {
		this.breadcrumbs = [
			{ label: 'Catalog', href: '?page=vf-catalog' },
			{
				label: 'Promo Codes',
				href: '?page=vendorfuel#!/catalog/promo-codes/0',
			},
		];

		$scope.activeTab = parseInt($stateParams.activeTab);
		$scope.addParams = {
			auto_add: false,
			require_all_items: false,
		};
		$scope.customerEndpoint = localized.apiURL + '/admin/customers/';
		$scope.discountTypes = {
			percentage: 'percentage',
			discount: 'discount',
		};
		$scope.addParams.discount_type = $scope.discountTypes.percentage; // Must be defined after discountTypes declared;
		$scope.isAuthed = Admin.Authed();
		$scope.loading = false;
		$scope.loadingMore = false;
		$scope.object = Object;
		$scope.productEndpoint = localized.apiURL + '/admin/products/';
		$scope.promocodeEndpoint = localized.apiURL + '/admin/promocodes/';
		$scope.rppValues = [15, 30, 50, 100];
		$scope.per_page = $scope.rppValues[0]; // Must be defined after rppValues is declared.
		$scope.promoCode = {};
		$scope.saved = false;
		$scope.saving = false;
		$scope.searchProductParams = {
			q: '',
			rpp: $scope.rppValues[0], // Must be defined after rppValues is declared.
			searchFields: ['sku', 'description', 'product_id'],
		};
		$scope.searchTerm = '';
		$scope.selectedPromocode = null;
		$scope.showChanges = false;
		$scope.updatedProducts = [];
		$scope.addedProducts = [];

		this.searchParams = {
			page: 1,
			q: '',
			orderBy: '',
			direction: '',
			rpp: $scope.rppValues[0], // Must be defined after rppValues is declared.
		};
		this.sortAscending = true;

		//If the view tab is selected, redirect to the search page since selected product is null
		if ($scope.activeTab === 2) {
			$scope.activeTab = 0;
		}
	};

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};

	const getPromoCodes = () => {
		PromoCodesService.query().then((response: any) => {
			$scope.promoCodes = response.promo_codes;
			$scope.loading = false;
		});
	};

	const editPromoCode = () => {
		const req: any = {
			method: 'GET',
			url: $scope.promocodeEndpoint,
		};
		req.url += $scope.selectedPromocode.id;
		req.params = $scope.searchProductParams;

		PromoCodesService.get($scope.selectedPromocode.id).then(
			(response: any) => {
				$scope.selectedPromocode = response.promo_code;
				$scope.selectedPromocode.auto_add = $scope.selectedPromocode
					.auto_add
					? true
					: false;
				$scope.selectedPromocode.date_effective = $scope
					.selectedPromocode.date_effective
					? new Date($scope.selectedPromocode.date_effective)
					: null;
				$scope.selectedPromocode.date_expires = $scope.selectedPromocode
					.date_expires
					? new Date($scope.selectedPromocode.date_expires)
					: null;
				$scope.selectedPromocode.require_all_items = $scope
					.selectedPromocode.require_all_items
					? true
					: false;
				$scope.selectedPromocode.customerName = response.promo_code
					.customer
					? response.promo_code.customer.name
					: '';
				$scope.loading = false;
			}
		);
	};

	$scope.TabChanged = (i: number) => {
		$scope.activeTab = i;
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;

		switch (i) {
			case 0:
				getPromoCodes();
				break;
			case 1:
				$scope.loading = false;
				break;
			case 2:
				editPromoCode();
				break;
		}
	};

	$scope.AddPromoCode = () => {
		$scope.loading = true;
		if ($scope.addedProducts.length > 0) {
			$scope.addParams.products = $scope.addedProducts.map(
				(product: any) => {
					return {
						product_id: product.id,
					};
				}
			);
		}
		const data = $scope.addParams;
		PromoCodesService.save(data).then((response: any) => {
			if (!response.errors.length && response.promo_code.id) {
				$scope.selectedPromocode = {
					id: response.promo_code.id,
				};
				$scope.activeTab = 2;
				$scope.addParams = {
					auto_add: false,
					require_all_items: false,
					products: {
						data: [],
					},
					discount_type: $scope.discountTypes.percentage,
				};
				$scope.addedProducts = [];
			}
			$scope.loading = false;
		});
	};

	$scope.ChangeTab = (
		tabIndex: number,
		promocodeIndex: number,
		event?: Event
	) => {
		if (event) {
			event.preventDefault();
		}
		$scope.activeTab = tabIndex;
		$scope.selectedPromocode = $scope.promoCodes.data[promocodeIndex];
	};

	$scope.CustomerSearchResults = (resp: any) => {
		//callback that is used by the search modal
		if (resp.length) {
			if ($scope.activeTab === 1) {
				$scope.addParams.customer_id = resp[0].value.id;
				$scope.addParams.customerName = resp[0].value.name;
				$scope.addParams.email = resp[0].value.email;
			} else {
				$scope.selectedPromocode.customer_id = resp[0].value.id;
				$scope.selectedPromocode.customerName = resp[0].value.name;
				$scope.selectedPromocode.email = resp[0].value.email;
			}
		}
	};

	this.deletePromoCode = () => {
		this.isDeleting = true;
		const id = $scope.selectedPromocode.id;
		PromoCodesService.delete(id).then(() => {
			this.isDeleting = false;
			$scope.activeTab = 0;
			$scope.selectedPromocode = null;
		});
	};

	$scope.OpenAddSearchModal = (type: 'customer' | 'product') => {
		const callback: any = {};
		let data = {};
		if (type === 'customer') {
			data = {
				tabs: [
					{
						http: {
							method: 'GET',
							url: $scope.customerEndpoint,
							params: {
								q: '',
							},
						},
						relationships: ['customers'],
						fields: ['id', 'name', 'email', 'status'],
						fieldPrefixes: [
							'ID: ',
							'Name: ',
							'Email: ',
							'Status: ',
						],
						id: 'id',
						selectOne: true,
					},
				],
			};
			callback.confirm = $scope.CustomerSearchResults;
		} else if (type === 'product') {
			data = {
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
			};
			callback.confirm = $scope.ProductSearchResults;
		}
		callback.cancel = () => {
			angular.noop();
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			$scope.addParams.code || 'New Promo Code',
			data,
			'Add Customer'
		);
	};
	$scope.OpenUpdateSearchModal = (type: 'customer' | 'product') => {
		const callback: any = {};
		let data = {};
		if (type === 'customer') {
			data = {
				tabs: [
					{
						http: {
							method: 'GET',
							url: $scope.customerEndpoint,
							params: {
								q: '',
							},
						},
						relationships: ['customers'],
						fields: ['id', 'name', 'email', 'status'],
						fieldPrefixes: [
							'ID: ',
							'Name: ',
							'Email: ',
							'Status: ',
						],
						id: 'id',
						selectOne: true,
					},
				],
			};
			callback.confirm = $scope.CustomerSearchResults;
		} else if (type === 'product') {
			data = {
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
					{
						http: {
							method: 'GET',
							url:
								$scope.promocodeEndpoint +
								$scope.selectedPromocode.id,
							params: {
								q: '',
							},
						},
						relationships: ['promo_code', 'products'],
						fields: ['sku', 'image', 'description', 'status'],
						fieldPrefixes: ['', '', '', 'Status: '],
						id: 'product_id',
					},
				],
			};
			callback.confirm = $scope.ProductSearchResults;
		}
		callback.cancel = () => {
			angular.noop();
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			$scope.selectedPromocode.code,
			data,
			'Add Items'
		);
	};
	$scope.ProductSearchResults = (resp: any) => {
		if (resp.length) {
			if ($scope.activeTab === 1) {
				if (
					$scope.addParams.products &&
					$scope.addParams.products.length
				) {
					const currentIds = $scope.addParams.products.map(
						(product: any) => product.product_id
					);
					for (let i = 0; i < resp.length; i++) {
						if (!currentIds.includes(resp[i].value.product_id)) {
							$scope.addedProducts.push(resp[i].value);
						}
					}
				} else {
					resp.forEach((item: any) => {
						$scope.addedProducts.push(item.value);
					});
				}
			} else {
				resp.forEach((item: any) => {
					const currentIds =
						$scope.selectedPromocode.products.data.map(
							(product: any) => product.product_id
						);
					const updatedIds = $scope.updatedProducts.map(
						(product: any) => product.product_id
					);
					if (
						item.action === 'add' &&
						!currentIds.includes(item.value.product_id)
					) {
						$scope.updatedProducts.push(item);
					}
					if (
						item.action === 'remove' &&
						!updatedIds.includes(item.value.product_id)
					) {
						$scope.updatedProducts.push(item);
					}
				});
			}
		}
	};

	$scope.SearchProducts = (page: number) => {
		$scope.loadingMore = true;
		$scope.searchTerm = $scope.searchProductParams.q;
		$scope.searchProductParams.page = page || 1;
		const req = {
			method: 'GET',
			url: $scope.promocodeEndpoint + $scope.selectedPromocode.id,
			params: $scope.searchProductParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.selectedPromocode.products = resp.products;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loadingMore = false;
			});
	};

	this.searchPromoCodes = () => {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: $scope.promocodeEndpoint,
			params: this.searchParams,
		};

		PromoCodesService.query(this.searchParams).then((response: any) => {
			$scope.promoCodes = response.promo_codes;
			$scope.loadingMore = false;
		});
	};

	this.setPage = (page: number) => {
		this.searchParams.page = page;
		this.searchPromoCodes();
	};

	this.setRpp = (rpp: number) => {
		this.searchParams.rpp = rpp;
		this.searchPromoCodes();
	};

	this.setQuery = (query: string) => {
		this.searchParams.page = 1; // Reset page when query changes.
		this.searchParams.q = query;
		$scope.searchTerm = this.searchParams.q;
		this.searchPromoCodes();
	};

	$scope.ShowChanges = () => {
		$scope.showChanges = !$scope.showChanges;
	};

	this.changeSortBy = (orderBy: string, e: Event) => {
		e.preventDefault();
		this.sortAscending =
			this.searchParams.orderBy === orderBy ? !this.sortAscending : true;
		this.searchParams.orderBy = orderBy;
		this.searchParams.direction = this.sortAscending ? 'asc' : 'desc';
		this.searchPromoCodes(this.searchParams.page);
	};

	$scope.UpdatePromoCode = () => {
		$scope.loading = true;
		$scope.selectedPromocode.products = [];
		if ($scope.updatedProducts.length > 0) {
			$scope.selectedPromocode.products = $scope.updatedProducts.map(
				(product: any) => {
					return {
						product_id: product.value.product_id,
					};
				}
			);
		}
		$scope.selectedPromocode.restricted_products = [];
		const id = $scope.selectedPromocode.id;
		const data = $scope.selectedPromocode;
		PromoCodesService.update(id, data).then(() => {
			$scope.loading = false;
		});
	};
}
