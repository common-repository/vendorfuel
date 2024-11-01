import template from './pricesheet-create.component.html';
export const PricesheetCreate: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'$state',
	'Admin',
	'Debug',
	'SearchModal',
	'Utils',
];

function controller(
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	Admin: any,
	Debug: any,
	SearchModal: any,
	Utils: any
) {
	this.breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-catalog' },
		{
			label: 'Price sheets',
			href: '?page=vf-catalog#/pricesheets',
		},
		{
			label: 'Add new',
			href: '?page=vendorfuel#!/catalog/pricesheets/create',
		},
	];

	this.resetTransactionType = () => {
		$scope.addParams.transaction_type = null;
	};

	this.$onInit = () => {
		$scope.addParams = {
			products: [],
		};
		$scope.editIndex = -1;
		$scope.editName = false;
		$scope.isAuthed = Admin.Authed();
		$scope.loading = true;
		$scope.loadingMore = false;
		$scope.myFile = {};
		$scope.object = Object;
		$scope.pricesheetEndpoint = localized.apiURL + '/admin/pricesheets/';
		$scope.productEndpoint = localized.apiURL + '/admin/products/';
		$scope.productsLoading = false;
		$scope.saved = false;
		$scope.saving = false;
		$scope.selectedPricesheet = null;
		$scope.searchTerm = '';
		$scope.updatedPricesheetItems = [];
		$scope.rppValues = [15, 30, 50, 100];
		$scope.searchParams = {
			rpp: $scope.rppValues[0], // Must be defined after rppValues is declared.
		};

		this.allPrShSearchParams = {
			page: 1,
			q: '',
			searchBy: '',
			orderBy: '',
			direction: '',
			rpp: $scope.rppValues[0], // Must be defined after rppValues is declared.
		};
		this.sortAscending = true;

		createPriceSheet();
	};

	const createPriceSheet = () => {
		$scope.loading = false;
	};

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};
	$scope.SearchResults = (resp: any) => {
		if ($scope.addParams.products) {
			resp.forEach((product: any) => {
				$scope.addParams.products.push(product);
				const currentIds = $scope.addParams.products.map(
					(product: any) => product.value.product_id
				);
				if (currentIds.includes(product.value.product_id)) {
					$scope.addParams.products[
						$scope.addParams.products.length - 1
					].price = product.value.price;
				}
			});
		} else {
			$scope.addParams.products = [];
		}
	};

	$scope.AddPricesheet = (id: number | null) => {
		$scope.loading = true;
		const updateParams: any = {
			products: [],
		};
		let isMissingNameOrProducts = false;
		let req: any = {};

		// Update price sheet
		if (id) {
			updateParams.transaction_type =
				$scope.selectedPricesheet.transaction_type;
			updateParams.clearSaleDisabled =
				$scope.selectedPricesheet.clearSaleDisabled;
			updateParams.sheet = $scope.selectedPricesheet.sheet;
			updateParams.default_price_sheet =
				$scope.selectedPricesheet.default_price_sheet;
			updateParams.site_id = $scope.selectedPricesheet.site_id;
			updateParams.gp_price_sheet =
				$scope.selectedPricesheet.gp_price_sheet;
			for (let i = 0; i < $scope.updatedPricesheetItems.length; i++) {
				if (
					$scope.updatedPricesheetItems[i].value.price.includes('$')
				) {
					$scope.updatedPricesheetItems[i].value.price =
						$scope.updatedPricesheetItems[i].value.price.slice(
							1,
							$scope.updatedPricesheetItems[i].value.price.length
						);
				}
				updateParams.products.push({
					product_id:
						$scope.updatedPricesheetItems[i].value.product_id,
					sku: $scope.updatedPricesheetItems[i].value.sku,
					price:
						$scope.updatedPricesheetItems[i].action === 'remove'
							? 0.0
							: $scope.updatedPricesheetItems[i].value.price,
				});
			}
			req = {
				method: 'PUT',
				url: $scope.pricesheetEndpoint + id,
				data: updateParams,
			};

			// Add new price sheet
		} else if ($scope.addParams.name && $scope.addParams.products) {
			updateParams.transaction_type = $scope.addParams.transaction_type;
			updateParams.clearSaleDisabled = $scope.addParams.clearSaleDisabled;
			updateParams.sheet = $scope.addParams.name;
			updateParams.default_price_sheet =
				$scope.addParams.default_price_sheet || false;
			updateParams.site_id = $scope.addParams.site_id;
			updateParams.gp_price_sheet = $scope.addParams.gp_price_sheet;
			for (let j = 0; j < $scope.addParams.products.length; j++) {
				if ($scope.addParams.products[j].value.price) {
					if (
						$scope.addParams.products[j].value.price.includes('$')
					) {
						$scope.addParams.products[j].value.price =
							$scope.addParams.products[j].value.price.slice(
								0,
								$scope.addParams.products[j].value.price.length
							);
					}
					updateParams.products.push({
						product_id:
							$scope.addParams.products[j].value.product_id,
						sku: $scope.addParams.products[j].value.sku,
						price: $scope.addParams.products[j].value.price,
					});
				}
			}
			req = {
				method: 'POST',
				url: $scope.pricesheetEndpoint,
				data: updateParams,
			};
		} else {
			isMissingNameOrProducts = true;
		}
		if (!isMissingNameOrProducts) {
			Utils.getHttpPromise(req)
				.then(
					(resp: any) => {
						if (!resp.errors.length) {
							if (!id) {
								$state.go('catalog.pricesheets.edit', {
									id: resp.price_sheet_id,
								});
								$scope.selectedPricesheet = {
									price_sheet_id: resp.price_sheet_id,
									sheet: req.data.sheet,
								};
								$scope.addParams = {};
								$scope.activeTab = 2;
							}
						}
					},
					(errResp: Error) => {
						Debug.error(errResp);
					}
				)
				.finally(() => {
					$scope.loading = false;
				});
		} else {
			$scope.loading = false;
		}
		$scope.editName = false;
	};

	$scope.EditPrice = (index: number) => {
		$scope.editIndex = index;
	};

	$scope.SearchCancelled = () => {};

	$scope.TransitionState = () => {
		$state.go('catalog.pricesheets.index', { activeTab: $scope.activeTab });
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
}
