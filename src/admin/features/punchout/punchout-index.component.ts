import template from './punchout-index.component.html';

export const PunchoutIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'$state',
	'$stateParams',
	'Admin',
	'ConfirmModal',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
];

function controller(
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	ConfirmModal: any,
	Settings: any,
	Debug: any,
	Utils: any,
	Localized: any
) {
	this.breadcrumbs = [
		{ label: 'Punchout', href: '?page=vf-admin#/punchout' },
		{ label: 'Suppliers', href: '?page=vendorfuel#!/punchout/suppliers/0' },
	];

	/**
	 * Sets the active tab based on whether it matches a index of accessible tabs.
	 *
	 * @param {number} tab
	 * @return {number | Object} Sets activeTab to the tab number, or reloads the state to reset the activeTab.
	 */
	const setActiveTab = (tab: number) => {
		const index = [0, 1];
		if (index.includes(tab)) {
			return ($scope.activeTab = tab);
		}
		return $state.go($state.current, { activeTab: 0 }, { reload: true });
	};

	setActiveTab(parseInt($stateParams.activeTab));
	$scope.addParams = {};
	$scope.addParams.domain_type = 'DUNS';
	$scope.admin = Admin;
	$scope.confirm = ConfirmModal;
	$scope.endpointBase = localized.apiURL + '/admin/punchout/supplier/';
	$scope.loading = false;
	$scope.loadingMore = false;
	$scope.localized = Localized;
	$scope.model = {};
	$scope.models = [];
	$scope.rppValues = [15, 30, 50, 100];
	$scope.saved = false;
	$scope.saving = false;
	$scope.searchParams = {
		q: '',
		sortBy: '',
		sortType: 'asc',
		rpp: $scope.rppValues[0],
	};
	$scope.settings = Settings;
	$scope.utils = Utils;

	this.selectSupplier = (id: number, e: Event) => {
		if (e) {
			e.preventDefault();
		}
		$scope.model.id = id;
		$scope.activeTab = 2;
	};

	$scope.LoginCallback = () => {
		$scope.loading = true;
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

	$scope.TabChanged = (i: number) => {
		$scope.activeTab = i;

		switch ($scope.activeTab) {
			case 0:
				if (!$scope.models.data) {
					$scope.Index();
				}
				break;
			case 2:
				if ($scope.model.id) {
					$scope.Show($scope.model.id);
				}
				break;
		}
	};

	//Index
	$scope.Index = (page: number) => {
		$scope.loadingMore = true;
		$scope.searchParams.page = page || 1;
		const req = {
			method: 'GET',
			url: $scope.endpointBase,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.models = resp.suppliers;
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
		$scope.model.id = id;
		const req = {
			method: 'GET',
			url: $scope.endpointBase + id,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.model = resp.supplier;
				},
				(errResp: Error) => {
					Debug.log(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	//Store
	$scope.Store = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.endpointBase,
			data: $scope.addParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					if (!resp.errors.length) {
						$scope.addParams = {};
						$scope.Show(resp.supplier.id);
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
		const req = {
			method: 'PUT',
			url: $scope.endpointBase + id,
			data: $scope.model,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {},
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
					url: $scope.endpointBase + id,
				};
				Utils.getHttpPromise(req)
					.then(
						() => {
							$scope.model = {};
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
		$scope.confirm.Show(
			callback,
			'Delete Supplier?',
			'This action cannot be undone.',
			'Back',
			'DELETE'
		);
	};

	$scope.AddEndpoint = (endpoints: any[]) => {
		endpoints.push({
			transaction: '',
			url: '',
		});
	};

	$scope.RemoveEndpoint = (endpoints: any[], index: number) => {
		endpoints.splice(index, 1);
	};

	$scope.RefreshEndpoints = (id: number) => {
		$scope.loading = true;
		const req = {
			method: 'GET',
			url: $scope.endpointBase + id + '/endpoints/refresh',
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.model = resp.supplier;
				},
				(errResp: Error) => {
					Debug.log(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};
}
