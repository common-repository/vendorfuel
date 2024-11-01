import { toast } from 'react-toastify';
import template from './parcels-page.component.html';

export const ParcelsPage: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = ['$scope', '$stateParams', 'Admin', 'Debug', 'Utils'];

function controller(
	$scope: ng.IScope,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Debug: any,
	Utils: any
) {
	/**
	 * Initialization
	 */
	this.$onInit = () => {
		this.breadcrumbs = [
			{ label: 'Shipping', href: '?page=vf-admin#/shipping' },
			{
				label: 'Shipping Parcels',
				href: '?page=vendorfuel#!/shipping/parcels/0',
			},
		];

		$scope.activeTab = parseInt($stateParams.activeTab) || 0;
		$scope.createParcel = {};
		$scope.distanceUnits = {
			in: 'Inches',
			cm: 'Centimeters',
		};
		$scope.gateways = {};
		$scope.isAuthed = Admin.Authed();
		$scope.loading = true;
		$scope.rppValues = [15, 30, 50, 100];
		$scope.saved = false;
		$scope.saving = false;
		$scope.searchParams = {
			q: '',
			sortBy: '',
			sortType: '',
			rpp: $scope.rppValues[0],
		};
		$scope.selectedParcel = null;
		$scope.shippingParcelEndpoint =
			localized.apiURL + '/admin/shipping/parcel/';
		$scope.warehouse = {};

		if ($scope.activeTab === 2 && !$scope.selectedParcel) {
			$scope.activeTab = 0;
		}
	};

	const getParcels = () => {
		const req = {
			method: 'GET',
			url: $scope.shippingParcelEndpoint,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.shippingParcels = resp.parcels;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	const editParcel = () => {
		const req = {
			method: 'GET',
			url: $scope.shippingParcelEndpoint,
		};
		req.url += $scope.selectedParcel.id;
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.selectedParcel = resp.parcel;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	const editGateways = () => {
		const req = {
			method: 'GET',
			url: $scope.shippingParcelEndpoint,
		};
		req.url = localized.apiURL + '/admin/shipping/gateways';
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					if (resp.gateways) {
						$scope.gateways = resp.gateways;
						if (
							typeof $scope.gateways.shippo === 'object' &&
							($scope.gateways.shippo.key ||
								$scope.gateways.shippo.key === '')
						) {
							$scope.gateways.shippo = $scope.gateways.shippo.key;
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
	};

	const editWarehouse = () => {
		const req = {
			method: 'GET',
			url: $scope.shippingParcelEndpoint,
		};
		req.url = localized.apiURL + '/admin/shipping/warehouse';
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					if (resp.warehouse) {
						$scope.warehouse = resp.warehouse;
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	$scope.TabChanged = (i: number) => {
		$scope.activeTab = i;
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;

		switch (i) {
			case 0:
				getParcels();
				break;
			case 1:
				$scope.loading = false;
				break;
			case 2:
				editParcel();
				break;
			case 3:
				editGateways();
				break;
			case 4:
				editWarehouse();
				break;
		}
	};

	$scope.ChangeTab = (tabIndex: number, index: number, e: Event) => {
		if (e) {
			e.preventDefault();
		}
		$scope.activeTab = tabIndex;
		$scope.selectedParcel = $scope.shippingParcels.data[index];
	};

	$scope.CreateParcel = () => {
		$scope.loading = true;
		const params = $scope.createParcel;
		const req = {
			method: 'POST',
			url: $scope.shippingParcelEndpoint,
			data: params,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					if (!resp.errors.length) {
						$scope.selectedParcel = { id: resp.parcel.id };
						$scope.createParcel = {};
						$scope.activeTab = 2;
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	$scope.SearchParcels = (page: number, query: string) => {
		$scope.loadingMore = true;
		$scope.searchParams.page = page || 1;
		$scope.searchParams.q = query;

		const req = {
			method: 'GET',
			url: $scope.shippingParcelEndpoint,
			params: $scope.searchParams,
		};

		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.shippingParcels = resp.parcels;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loadingMore = false;
			});
	};
	$scope.UpdateParcel = () => {
		$scope.loading = true;
		const req = {
			method: 'PUT',
			url: $scope.shippingParcelEndpoint + $scope.selectedParcel.id,
			data: $scope.selectedParcel,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};
	$scope.UpdateWarehouse = () => {
		$scope.loading = true;
		const params = $scope.warehouse;
		const req = {
			method: 'PUT',
			url: localized.apiURL + '/admin/shipping/warehouse',
			data: params,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};
	$scope.UpdateGateways = () => {
		$scope.loading = true;
		const params = { gateways: $scope.gateways };
		const req = {
			method: 'PUT',
			url: localized.apiURL + '/admin/shipping/gateways',
			data: params,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
				toast.success('Gateway successfully updated.');
			});
	};
}
