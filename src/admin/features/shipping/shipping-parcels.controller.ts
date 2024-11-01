( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.controller( 'ShippingParcelsController', ShippingParcelsController );

	ShippingParcelsController.$inject = [
		'$scope',
		'$rootScope',
		'$stateParams',
		'Admin',
		'Settings',
		'Debug',
		'Utils',
		'Localized',
	];

	/**
	 * @param {Object} $scope       Angular service
	 * @param {Object} $rootScope   Angular service
	 * @param {Object} $stateParams UI Router service
	 * @param {Object} Admin        VendorFuel service
	 * @param {Object} Settings     VendorFuel service
	 * @param {Object} Debug        VendorFuel service
	 * @param {Object} Utils        VendorFuel service
	 * @param {Object} Localized    VendorFuel service
	 */
	function ShippingParcelsController(
		$scope: any,
		$rootScope: any,
		$stateParams: ng.ui.IStateParamsService,
		Admin: any,
		Settings: any,
		Debug: any,
		Utils: any,
		Localized: any,
	) {
		/**
		 * Initialization
		 */
		this.init = () => {
			this.breadcrumbs = [
				{ name: 'Shipping', state: 'shipping.page' },
				{ name: 'Shipping Parcels', state: 'shipping.parcels.index' },
			];

			$scope.activeTab = parseInt( $stateParams.activeTab ) || 0;
			$scope.createParcel = {};
			$scope.distanceUnits = {
				in: 'Inches',
				cm: 'Centimeters',
			};
			$scope.gateways = {};
			$scope.isAuthed = Admin.Authed();
			$scope.loading = true;
			$scope.rppValues = [ 15, 30, 50, 100 ];
			$scope.saved = false;
			$scope.saving = false;
			$scope.searchParams = {
				q: '',
				sortBy: '',
				sortType: '',
				rpp: $scope.rppValues[ 0 ],
			};
			$scope.selectedParcel = null;
			$scope.shippingParcelEndpoint =
				localized.apiURL + '/admin/shipping/parcel/';
			$scope.warehouse = {};

			if ( $scope.activeTab === 2 && ! $scope.selectedParcel ) {
				$scope.activeTab = 0;
			}
		};
		this.init();

		//FUNCTIONS
		$scope.TabChanged = function( i: number ) {
			$scope.activeTab = i;
			Settings.errors = {};
			$scope.loading = true;
			$scope.saving = false;
			$scope.saved = false;
			const req = {
				method: 'GET',
				url: $scope.shippingParcelEndpoint,
			};
			switch ( i ) {
				case 0:
					Utils.getHttpPromise( req )
						.then(
							function( resp: any ) {
								$scope.shippingParcels = resp.parcels;
							},
							function( errResp: Error ) {
								Debug.error( errResp );
							},
						)
						.finally( function() {
							$scope.loading = false;
						} );
					break;
				case 1:
					$scope.loading = false;
					break;
				case 2:
					req.url += $scope.selectedParcel.id;
					Utils.getHttpPromise( req )
						.then(
							function( resp: any ) {
								$scope.selectedParcel = resp.parcel;
							},
							function( errResp: Error ) {
								Debug.error( errResp );
							},
						)
						.finally( function() {
							$scope.loading = false;
						} );
					break;
				case 3:
					req.url = localized.apiURL + '/admin/shipping/gateways';
					Utils.getHttpPromise( req )
						.then(
							function( resp: any ) {
								if ( resp.gateways ) {
									$scope.gateways = resp.gateways;
									if (
										typeof $scope.gateways.shippo ===
										'object' &&
										( $scope.gateways.shippo.key ||
											$scope.gateways.shippo.key === '' )
									) {
										$scope.gateways.shippo =
											$scope.gateways.shippo.key;
									}
								}
							},
							function( errResp: Error ) {
								Debug.error( errResp );
							},
						)
						.finally( function() {
							$scope.loading = false;
						} );
					break;
				case 4:
					req.url = localized.apiURL + '/admin/shipping/warehouse';
					Utils.getHttpPromise( req )
						.then(
							function( resp: any ) {
								if ( resp.warehouse ) {
									$scope.warehouse = resp.warehouse;
								}
							},
							function( errResp: Error ) {
								Debug.error( errResp );
							},
						)
						.finally( function() {
							$scope.loading = false;
						} );
					break;
			}
		};
		$scope.ChangeTab = function( tabIndex: number, index: number ) {
			$scope.activeTab = tabIndex;
			$scope.selectedParcel = $scope.shippingParcels.data[ index ];
		};
		$scope.CreateParcel = function() {
			$scope.loading = true;
			const params = $scope.createParcel;
			const req = {
				method: 'POST',
				url: $scope.shippingParcelEndpoint,
				data: params,
			};
			Utils.getHttpPromise( req )
				.then(
					function( resp: any ) {
						if ( ! resp.errors.length ) {
							$scope.selectedParcel = { id: resp.parcel.id };
							$scope.createParcel = {};
							$scope.activeTab = 2;
						}
					},
					function( errResp: Error ) {
						Debug.error( errResp );
					},
				)
				.finally( function() {
					$scope.loading = false;
				} );
		};

		$scope.SearchParcels = function( page: number, query: string ) {
			$scope.loadingMore = true;
			$scope.searchParams.page = page || 1;
			$scope.searchParams.q = query;

			const req = {
				method: 'GET',
				url: $scope.shippingParcelEndpoint,
				params: $scope.searchParams,
			};

			Utils.getHttpPromise( req )
				.then(
					function( resp: any ) {
						$scope.shippingParcels = resp.parcels;
					},
					function( errResp: Error ) {
						Debug.error( errResp );
					},
				)
				.finally( function() {
					$scope.loadingMore = false;
				} );
		};
		$scope.UpdateParcel = function() {
			$scope.loading = true;
			const req = {
				method: 'PUT',
				url: $scope.shippingParcelEndpoint + $scope.selectedParcel.id,
				data: $scope.selectedParcel,
			};
			Utils.getHttpPromise( req )
				.then(
					function() { },
					function( errResp: Error ) {
						Debug.error( errResp );
					},
				)
				.finally( function() {
					$scope.loading = false;
				} );
		};
		$scope.UpdateWarehouse = function() {
			$scope.loading = true;
			const params = $scope.warehouse;
			const req = {
				method: 'PUT',
				url: localized.apiURL + '/admin/shipping/warehouse',
				data: params,
			};
			Utils.getHttpPromise( req )
				.then(
					function() { },
					function( errResp: Error ) {
						Debug.error( errResp );
					},
				)
				.finally( function() {
					$scope.loading = false;
				} );
		};
		$scope.UpdateGateways = function() {
			$scope.loading = true;
			const params = { gateways: $scope.gateways };
			const req = {
				method: 'PUT',
				url: localized.apiURL + '/admin/shipping/gateways',
				data: params,
			};
			Utils.getHttpPromise( req )
				.then(
					function() { },
					function( errResp: Error ) {
						Debug.error( errResp );
					},
				)
				.finally( function() {
					$scope.loading = false;
					Localized.setNotification( {
						type: 'success',
						message: 'Gateway Successfully Updated',
					} );
				} );
		};
	}
}() );
