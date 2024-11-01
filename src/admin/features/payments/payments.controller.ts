( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.controller( 'PaymentsController', PaymentsController );

	PaymentsController.$inject = [
		'$filter',
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
	 * @param {Object} $filter      Angular service
	 * @param {Object} $scope       Angular service
	 * @param {Object} $rootScope   Angular service
	 * @param {Object} $stateParams UI Router service
	 * @param {Object} Admin        VendorFuel service
	 * @param {Object} Settings     VendorFuel service
	 * @param {Object} Debug        VendorFuel service
	 * @param {Object} Utils        VendorFuel service
	 * @param {Object} Localized    VendorFuel service
	 */
	function PaymentsController(
		$filter: ng.IFilterService,
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
				{ name: 'Payments', state: 'payments' },
			];

			$scope.activeTab = parseInt( $stateParams.activeTab ) || 0;
			$scope.addParams = {};
			$scope.gateway = {};
			$scope.gateways = [];
			$scope.gatewaysEndpoint = localized.apiURL + '/admin/gateways/';
			$scope.isAuthed = Admin.Authed();
			$scope.loading = false;
			$scope.rppValues = [ 15, 30, 50, 100 ];
			$scope.searchParams = {
				q: '',
				sortBy: '',
				sortType: '',
				rpp: $scope.rppValues[ 0 ],
			};
			$scope.selectedGateway = null;
			$scope.templates =
				[
					{ name: 'Qualpay', url: localized.dir.url + '/assets/templates/QualPay.html' },
					{ name: 'AuthorizeNet', url: localized.dir.url + '/assets/templates/AuthorizeNet.html' },
					{ name: 'PayPal', url: localized.dir.url + '/assets/templates/PayPal.html' },
					{ name: 'PayFabric', url: localized.dir.url + '/assets/templates/PayFabric.html' },
					{ name: 'Stripe', url: localized.dir.url + '/assets/templates/Stripe.html' },
					{ name: 'SquareUp', url: localized.dir.url + '/assets/templates/SquareUp.html' },
				];
			$scope.template = $scope.templates[ 0 ]; // Must come after templates declaration.
		};
		this.init();

		//FUNCTIONS
		$scope.LoginCallback = function() {
			$scope.loading = true;
			//logged in, do something. i.e. make api calls to load current tab's data
		};

		$scope.retrieveGateways = function() {
			$scope.loading = true;
			const req = {
				method: 'GET',
				url: $scope.gatewaysEndpoint,
			};

			Utils.getHttpPromise( req ).then( function( resp: any ) {
				$scope.gateways = resp.gateways;
				angular.forEach( $scope.gateways, function( value, key ) {
					if ( value.enabled && value.enabled !== 0 ) {
						$scope.template = $filter( 'filter' )( $scope.templates, { name: key } )[ 0 ];
					}
				} );
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		};

		$scope.TabChanged = function( i: number ) {
			$scope.activeTab = i;
			Settings.errors = {};
			$scope.retrieveGateways();
		};

		$scope.disableGateway = function( gateway: any ) {
			const data = {
				gateways: gateway,
			};
			const req = {
				method: 'PUT',
				url: $scope.gatewaysEndpoint,
				data,
			};
			Utils.getHttpPromise( req ).then( function() {
				if ( 'paypal' in gateway ) {
					Utils.httpDelete( Localized.wpRestUrl + '/settings/paypal', {}, {
						paypal_client_id: gateway.paypal.client_id,
					} );
				}

				if ( 'authnet' in gateway ) {
					Utils.httpDelete( Localized.wpRestUrl + '/settings/authnet', {}, {
						public_key: gateway.authnet.key,
						id: gateway.authnet.id,
					} );
				}

				if ( 'stripe' in gateway ) {
					Utils.httpDelete( Localized.wpRestUrl + '/settings/stripe', {}, {
						stripe_pk: gateway.stripe.publishableKey,
					} );
				}

				if ( 'squareup' in gateway ) {
					Utils.httpDelete( Localized.wpRestUrl + '/settings/squareup', {}, {
						location_id: gateway.squareup.locationID,
					} );
				}

				Utils.httpPut( Localized.wpRestUrl + '/payment/enabled', {}, {
					gateway,
				} );
			}, function( errResp: any ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
				$scope.retrieveGateways();
			} );
		};

		$scope.updateGateway = function( gateway: any ) {
			const data = {
				gateways: gateway,
			};
			const req = {
				method: 'PUT',
				url: $scope.gatewaysEndpoint,
				data,
			};
			Utils.getHttpPromise( req ).then( function() {
				if ( 'paypal' in gateway ) {
					Utils.httpPut( Localized.wpRestUrl + '/settings/paypal', {}, {
						paypal_client_id: gateway.paypal.client_id,
					} );
				}

				if ( 'authnet' in gateway ) {
					Utils.httpPut( Localized.wpRestUrl + '/settings/authnet', {}, {
						public_key: gateway.authnet.key,
						id: gateway.authnet.id,
					} );
				}

				if ( 'stripe' in gateway ) {
					Utils.httpPut( Localized.wpRestUrl + '/settings/stripe', {}, {
						stripe_pk: gateway.stripe.publishableKey,
					} );
				}

				if ( 'squareup' in gateway ) {
					Utils.httpPut( Localized.wpRestUrl + '/settings/squareup', {}, {
						location_id: gateway.squareup.locationID,
					} );
				}

				Utils.httpPut( Localized.wpRestUrl + '/payment/enabled', {}, {
					gateway,
				} );
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		};

		$scope.authorizeAccess = function( processorIndex: number ) {
			$scope.loading = true;
			const req = {
				method: 'GET',
				url: localized.apiURL + '/admin/payments/' + processorIndex + '/authorize',
			};

			Utils.getHttpPromise( req ).then( function( resp: any ) {
				window.open( resp.auth_url, '_blank' );
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		};

		$scope.revokeAccess = function( processorIndex: number ) {
			$scope.loading = true;
			const req = {
				method: 'GET',
				url: localized.apiURL + '/admin/payments/' + processorIndex + '/revoke',
			};

			Utils.getHttpPromise( req ).then( function() {
				//window.open(resp.auth_url,'_blank');
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		};

		$scope.ChangeTab = function( tabIndex: number ) {
			$scope.activeTab = tabIndex;
		};
	}
}() );
