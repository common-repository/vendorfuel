( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.controller( 'BillingResetPasswordController', BillingResetPasswordController );

	BillingResetPasswordController.$inject = [
		'$scope',
		'Admin',
		'Localized',
		'Utils',
		'$location',
		'$stateParams',
		'Debug',
	];

	/**
	 * @param {Object} $scope       Angular service
	 * @param {Object} Admin        VendorFuel service
	 * @param {Object} Localized    VendorFuel service
	 * @param {Object} Utils        VendorFuel service
	 * @param {Object} $location    Angular service
	 * @param {Object} $stateParams UI Router service
	 * @param {Object} Debug        VendorFuel service
	 */
	function BillingResetPasswordController(
		$scope: any,
		Admin: any,
		Localized: any,
		Utils: any,
		$location: ng.ILocationService,
		$stateParams: ng.ui.IStateParamsService,
		Debug: any,
	) {
		/**
		 * Initialization
		 */
		this.init = () => {
			Admin.login_errors = {};
			Utils.redirecting = false;

			$scope.isAuthed = Admin.Authed();
			$scope.password = '';
			$scope.password_confirmation = '';
			$scope.requesting = false;
			$scope.resetEmail = null;
			$scope.showPassword = false;
			$scope.showPasswordConfirmation = false;

			if ( $stateParams.code && $stateParams.auth ) {
				$scope.reseting = true;
			}
		};
		this.init();

		$scope.trimExtraSp = function( str: string ) {
			return str.replace( /\s+/g, '' );
		};

		$scope.ToggleShowPassword = function() {
			$scope.showPassword = ! $scope.showPassword;
		};
		$scope.ToggleShowPasswordConfirmation = function() {
			$scope.showPasswordConfirmation = ! $scope.showPasswordConfirmation;
		};

		$scope.requestReset = function() {
			Admin.login_errors = {};
			$scope.requesting = true;
			const req = {
				method: 'POST',
				url: localized.apiURL + '/tenant/password/request',
				data: { email: $scope.resetEmail, url: $location.absUrl() },
			};

			Utils.getHttpPromise( req ).then( function() {
				$scope.requested = true;
				$scope.requesting = false;
			}, function() {
			} ).finally( function() {
				$scope.loading = false;
			} );
		};

		$scope.submitReset = function() {
			Admin.login_errors = {};
			$scope.submitting = true;
			const req = {
				method: 'POST',
				url: localized.apiURL + '/tenant/password/reset',
				data: {
					code: $stateParams.code,
					auth: $stateParams.auth,
					password: $scope.password,
					password_confirmation: $scope.password_confirmation,
				},
			};

			Utils.getHttpPromise( req ).then( function( resp: any ) {
				Admin.SetTokens( resp.name, resp.tokena, resp.tokenb, false, resp.token );
				Utils.setLocation( '/dashboard' );
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.submitting = false;
			} );
		};
	}
}() );

