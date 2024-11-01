import template from './index.template.html';
import { apiURL } from '../../../data/apiURL';
import breadcrumbs from '../../../features/purchasing/cost-sheets/breadcrumbs.json';
import type { ConfirmModalService } from '../../../components/ui/modals/confirm-modal.service';

export const PurchasingCostSheetsComponent: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'Admin',
	'ConfirmModal',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
	'SearchModal',
];

function controller(
	$scope: ng.IScope,
	Admin: any,
	ConfirmModal: ConfirmModalService,
	Settings: any,
	Debug: any,
	Utils: any,
	Localized: any,
	SearchModal: any
) {
	this.breadcrumbs = breadcrumbs;
	this.nav = [
		{
			label: 'Upload',
			href: '?page=vf-purchasing#/cost-sheets/uploads/create',
		},
		{
			label: 'Manage uploads',
			href: '?page=vf-purchasing#/cost-sheets/uploads',
		},
	];

	$scope.loading = false;
	$scope.loadingMore = false;
	$scope.productsLoading = false;
	$scope.saving = false;
	$scope.saved = false;
	$scope.loadingMore = false;
	$scope.productEndpoint = localized.apiURL + '/admin/products/';
	$scope.vendorEndpoint = localized.apiURL + '/admin/purchasing/vendors/';
	$scope.supplierEndpoint = localized.apiURL + '/admin/punchout/suppliers/';
	$scope.docProfileEndpoint =
		localized.apiURL + '/admin/purchasing/document-profile/';
	$scope.costSheets = [];
	$scope.costSheet = {};
	$scope.vendor = {};
	$scope.supplier = {};
	$scope.transmitting_document_profile = {};
	$scope.receiving_document_profile = {};
	$scope.document_profiles = {};
	$scope.addParams = {
		costs: [],
	};
	$scope.editName = false;
	$scope.updatedCosts = [];
	$scope.editIndex = -1;
	$scope.object = Object;
	$scope.myFile = {};
	$scope.showChanges = false;
	$scope.rppValues = [15, 30, 50, 100];
	$scope.searchParams = {
		q: '',
		searchBy: '',
		sortBy: '',
		sortType: '',
		perPage: $scope.rppValues[0],
	};

	$scope.sortAscending = true;

	//FACTORIES
	$scope.admin = Admin;
	$scope.settings = Settings;
	$scope.localized = Localized;
	$scope.utils = Utils;

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};

	const getCostSheets = () => {
		if (!$scope.costSheets.data) {
			$scope.Index();
		}
	};

	const editCostSheet = () => {
		if ($scope.costSheet.id) {
			$scope.searchParams = {
				q: '',
				searchBy: '',
				sortBy: '',
				sortType: '',
				perPage: $scope.rppValues[0],
			};
			$scope.Show($scope.costSheet.id);
		}
	};

	$scope.TabChanged = (i: number) => {
		$scope.activeTab = i;
		$scope.loading = true;
		switch ($scope.activeTab) {
			//Only retrieve new index if no data is present
			//This way previous searches are retained
			case 0:
				getCostSheets();
				break;
			case 2:
				editCostSheet();
				break;
		}

		$scope.loading = false;
	};

	$scope.ChangeTab = (tab: number) => {
		$scope.activeTab = tab;
	};

	$scope.SortIndex = (sortBy: string) => {
		$scope.sortAscending =
			$scope.searchParams.sortBy === sortBy
				? !$scope.sortAscending
				: true;
		$scope.searchParams.sortBy = sortBy;
		$scope.searchParams.sortType = $scope.sortAscending ? 'asc' : 'desc';
		$scope.Index($scope.searchParams.page);
	};

	//Index
	$scope.Index = (page: number) => {
		$scope.loadingMore = true;
		$scope.searchParams.page = page || 1;
		const req = {
			method: 'GET',
			url: apiURL.COSTSHEETS,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.costSheets = resp.cost_sheets;
					$scope.vendors = resp.vendors;
					$scope.suppliers = resp.suppliers;
					$scope.document_profiles = resp.document_profiles;
				},
				(errResp: Error) => {
					Debug.log(errResp);
				}
			)
			.finally(() => {
				$scope.loadingMore = false;
				$scope.loading = false;
			});
	};

	//Show
	$scope.Show = (id: number) => {
		$scope.loading = true;
		$scope.costSheet.id = id;
		const req = {
			method: 'GET',
			url: `${apiURL.COSTSHEETS}/${id}`,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.costSheet = resp.cost_sheet;
					$scope.costSheet.cost_margin *= 100;
					$scope.vendors = resp.vendors;
					$scope.suppliers = resp.suppliers;
					$scope.document_profiles = resp.document_profiles;
				},
				(errResp: Error) => {
					Debug.log(errResp);
				}
			)
			.finally(() => {
				$scope.showChanges = false;
				$scope.loading = false;
			});
	};

	//Store
	$scope.Store = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: apiURL.COSTSHEETS,
			data: $scope.addParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					if (!resp.errors.length) {
						$scope.addParams = {};
						$scope.vendor = {};
						$scope.supplier = {};
						$scope.Show(resp.cost_sheet.id);
						$scope.TabChanged(2);
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

	//Update
	$scope.Update = (id: number) => {
		$scope.loading = true;
		$scope.updatedCosts.forEach((cost: any) => {
			if (cost.action === 'remove') {
				cost.value.cost = 0.0;
			}
			$scope.costSheet.costs.data.push(cost.value);
		});
		$scope.costSheet.costs = $scope.costSheet.costs.data;
		const req = {
			method: 'PUT',
			url: `${apiURL.COSTSHEETS}/${id}`,
			data: $scope.costSheet,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {
					$scope.updatedCosts = [];
					$scope.Show(id);
				},
				(errResp: Error) => {
					Debug.log(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	//Delete
	$scope.Delete = (id: number) => {
		const callback = {
			confirm() {
				$scope.loading = true;
				const req = {
					method: 'DELETE',
					url: `${apiURL.COSTSHEETS}/${id}`,
				};
				Utils.getHttpPromise(req)
					.then(
						() => {
							$scope.costSheet = {};
							$scope.activeTab = 0;
							$scope.Index();
						},
						(errResp: Error) => {
							Debug.log(errResp);
						}
					)
					.finally(() => {
						$scope.loading = false;
					});
			},
			cancel() {},
		};
		ConfirmModal.show(
			callback,
			'Delete Cost Sheet?',
			'This action cannot be undone.',
			'Cancel',
			'Delete'
		);
	};

	$scope.SearchResults = (resp: any) => {
		//callback that is used by the search modal
		if ($scope.activeTab === 1) {
			if ($scope.addParams.costs) {
				resp.forEach((product: any) => {
					$scope.addParams.costs.push(product);
					const currentIds = $scope.addParams.costs.map(
						(product: any) => product.value.product_id
					);
					if (currentIds.includes(product.value.product_id)) {
						$scope.addParams.costs[
							$scope.addParams.costs.length - 1
						].cost = product.value.cost;
					}
				});
			} else {
				$scope.addParams.costs = [];
			}
		} else if ($scope.activeTab === 2) {
			const currentIds = $scope.updatedCosts.map(
				(item: any) => item.value.product_id
			);
			$scope.updatedCosts = [];
			resp.forEach((item: any) => {
				const included = currentIds.includes(item.value.product_id);
				if (item.action === 'add') {
					$scope.updatedCosts.push({
						action: 'add',
						value: {
							product_id: item.value.product_id,
							sku: item.value.sku,
							vendor_sku: item.value.sku,
							uomid: item.value.uomid,
							uomqty: item.value.uomqty,
							cost: included ? item.value.cost : 0.0,
							product: included ? item.value.product : item.value,
							image: item.value.image,
						},
					});
				} else if (item.action === 'remove') {
					$scope.updatedCosts.push(item);
				}
			});
		}
	};

	$scope.editParams = (item: any) => {
		for (let i = 0; i < $scope.updatedCosts.length; i++) {
			if ($scope.updatedCosts[i].value.product_id === item.product_id) {
				if ($scope.updatedCosts[i].action === 'remove') {
					return;
				}
				$scope.updatedCosts[i].value.cost = item.cost;
				return;
			}
		}
		$scope.updatedCosts.push({
			action: 'edited',
			value: item,
		});
	};

	$scope.ShowChanges = () => {
		$scope.showChanges = !$scope.showChanges;
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
							excludedField: 'cost_sheet_index_id',
							excludedId: $scope.costSheet.id,
							excludedTable: 'cost_sheets',
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
						url: `${apiURL.COSTSHEETS}/${$scope.costSheet.id}`,
						params: {
							q: '',
						},
					},
					relationships: ['cost_sheet', 'costs'],
					fields: ['sku', 'image', 'description', 'cost'],
					fieldPrefixes: ['', '', '', 'Cost: '],
					id: 'product_id',
				},
			],
			updatedItems: $scope.cost,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel() {},
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(callback, $scope.costSheet.sheet, config, 'Add items');
	};
}
