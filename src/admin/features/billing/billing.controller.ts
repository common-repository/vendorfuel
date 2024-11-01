( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.controller( 'BillingController', BillingController );

	BillingController.$inject = [
		'$scope',
		'$rootScope',
		'$state',
		'$stateParams',
		'Admin',
		'Tenant',
		'ConfirmModal',
		'Settings',
		'Debug',
		'Utils',
		'Localized',
	];

	/**
	 * @param {Object} $scope       Angular service
	 * @param {Object} $rootScope   Angular service
	 * @param {Object} $state       UI Router service
	 * @param {Object} $stateParams UI Router service
	 * @param {Object} Admin        VendorFuel service
	 * @param {Object} Tenant       VendorFuel service
	 * @param {Object} ConfirmModal VendorFuel service
	 * @param {Object} Settings     VendorFuel service
	 * @param {Object} Debug        VendorFuel service
	 * @param {Object} Utils        VendorFuel service
	 * @param {Object} Localized    VendorFuel service
	 */
	function BillingController(
		$scope: any,
		$rootScope: any,
		$state: ng.ui.IStateService,
		$stateParams: ng.ui.IStateParamsService,
		Admin: any,
		Tenant: any,
		ConfirmModal: any,
		Settings: any,
		Debug: any,
		Utils: any,
		Localized: any,
	) {
		/**
		 * Initialization
		 */
		this.init = () => {
			this.breadcrumbs = [ {
				name: 'VendorFuel Subscription', state: 'billing',
			},
			];

			$scope.activeTab = parseInt( $stateParams.activeTab );
			$scope.isAuthed = Admin.Authed();
			$scope.loading = true;
			$scope.loadedWallet = false;
			$scope.loadingWallet = false;
			$scope.localized = Localized;
			$scope.saved = false;
			$scope.saving = false;
			$scope.settings = Settings;
			$scope.tenant = Tenant;
			$scope.walletUrl = null;
			$scope.utils = Utils;

			if ( $stateParams.id ) {
				updateBilling( $stateParams.id );
			}

			loadBillingSettings();

			window.addEventListener( 'message', ( event ) => {
				if ( event.origin === 'https://api.vendorfuel.com' || event.origin === 'https://dev.vendorfuel.com' ) {
					const timer = setInterval( function() {
						clearInterval( timer );
						$scope.walletUrl = null;
						loadBillingSettings();
					}, 3000 );
				}
			}, false );
		};
		this.init();

		/**
		 * @param {number} id Billing ID
		 */
		function updateBilling( id: number ) {
			Settings.billing.saved.cardId = id;
			delete ( Settings.billing.saved.card );
			const req = {
				method: 'POST',
				url: localized.apiURL + '/tenant/billing/update',
				data: Settings.billing.saved,
			};

			Utils.getHttpPromise( req ).then( function( resp: any ) {
				Debug.log( resp );
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		}

		$scope.retrieveWalletUrl = function() {
			if ( ! $scope.loadingWallet && ! $scope.loadedWallet ) {
				$scope.loadingWallet = true;
				$scope.loadedWallet = false;

				const req = {
					method: 'GET',
					url: localized.apiURL + '/tenant/billing/wallet/url',
					params: { return_url: localized.apiURL + '/tenant/PayFabricReturn/' },
				};
				Utils.getHttpPromise( req ).then( function( resp: any ) {
					$scope.walletUrl = resp.url;
					$scope.loadedWallet = true;
				}, function( errResp: Error ) {
					Debug.error( errResp );
				} ).finally( function() {
					$scope.loadingWallet = false;
				} );
			}
		};

		//FUNCTIONS
		$scope.LoginCallback = function() {
			$scope.loading = true;
			loadBillingSettings();
		};

		$scope.TransitionState = function() {
			$state.go( 'settings' );
		};

		$scope.SubmitUpdate = function( i: any, form: any ) {
			$scope.UpdateBillingSettings( form );
		};

		/**
		 * @param {any} tab Tab
		 * @return {Object} Promise
		 */
		function getSettings( tab: any ) {
			const promise = tab.Get().then( function successCallback() {
				$scope.loading = false;
			}, function errorCallback() {
				$scope.loading = false;
			} );
			return promise;
		}
		/**
		 * @param {any}    tab  Tab
		 * @param {Object} form Form data
		 * @return {Object} Promise
		 */
		function updateSettings( tab: any, form: any ) {
			Settings.errors = {};
			$scope.saving = true;
			$scope.saved = false;
			$scope.cancelled = false;
			const promise = tab.Set().then( function successCallback() {
				$scope.saving = false;
				$scope.saved = Object.keys( Settings.errors ).length === 0;
				form.$setPristine();
				form.$setUntouched();
			}, function errorCallback() {
				$scope.saving = false;
			} );
			return promise;
		}
		$scope.LoadGatewaysSettings = function() {
			$scope.loading = true;
			if ( Admin.Authed() ) {
				getSettings( Settings.gateways );
			} else {
				$scope.loading = false;
			}
		};

		/**
		 * @param {any} r ?
		 */
		function loadBillingSettings( r?: boolean ) {
			if ( ! r ) {
				r = false;
			}
			$scope.loading = true;
			if ( $scope.tenant.Authed() ) {
				getSettings( Settings.billing );
			} else {
				$scope.loading = false;
			}
		}

		$scope.UpdateGeneralSettings = function( form: any ) {
			if ( Settings.general.saved.api_url === '' || Settings.general.saved.api_key === '' ) {
				Admin.Logout();
			}
			updateSettings( Settings.general, form );
		};
		$scope.UpdateConversionsSettings = function( form: any ) {
			updateSettings( Settings.conversions, form );
		};
		$scope.UpdateImageSettings = function( form: any ) {
			updateSettings( Settings.image, form );
		};
		$scope.UpdateGatewaysSettings = function( form: any ) {
			updateSettings( Settings.gateways, form );
		};
		$scope.UpdateBillingSettings = function( form: any ) {
			updateSettings( Settings.billing, form ).then( function() {
				getSettings( Settings.billing );
			} );
		};
		$scope.CancelSubscription = function() {
			$scope.saving = true;
			$scope.saved = false;
			$scope.cancelled = false;
			Settings.billing.cancelling = true;
			Settings.billing.Cancel().then( function() {
				getSettings( Settings.billing ).then( function() {
					$scope.saving = false;
					if ( Settings.billing.saved.status !== 'active' ) {
						$scope.cancelled = true;
						Settings.billing.cancelling = false;
					}
				} );
			} );
		};
		$scope.SubscriptionNotcancelled = function() {
			Debug.log( 'CANCELLATION NOT CONFIRMED!' );
		};

		$scope.ConfirmCancelSubscription = function() {
			const callback = {
				confirm: $scope.DoubleCancellation,
				cancel: $scope.SubscriptionNotcancelled,
			};
			ConfirmModal.Show( callback, 'Are you sure you want to cancel your subscription?', 'If there is anything we can do to change your mind please let us know.', 'No', 'Yes' );
		};
		$scope.DoubleCancellation = function() {
			const callback = {
				confirm: $scope.CancelSubscription,
				cancel: $scope.SubscriptionNotcancelled,
			};
			ConfirmModal.Show( callback, 'Are you absolutely sure?', 'We will be sorry to see you go...', 'No', 'Yes' );
		};
	}
}() );

