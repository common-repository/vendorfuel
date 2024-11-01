( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.controller( 'ResetPasswordController', ResetPasswordController );

	ResetPasswordController.$inject = [
		'$scope',
		'Admin',
		'Localized',
		'Utils',
		'$location',
		'$stateParams',
	];

	/**
	 * @param {Object} $scope       Angular service
	 * @param {Object} Admin        VendorFuel service
	 * @param {Object} Localized    VendorFuel service
	 * @param {Object} Utils        VendorFuel service
	 * @param {Object} $location    Angular service
	 * @param {Object} $stateParams UI Router service
	 */
	function ResetPasswordController(
		$scope: any,
		Admin: any,
		Localized: any,
		Utils: any,
		$location: ng.ILocationService,
		$stateParams: ng.ui.IStateParamsService,
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
				url: localized.apiURL + '/admin/password-reset/request',
				data: { email: $scope.resetEmail, url: $location.absUrl() },
			};

			Utils.getHttpPromise( req )
				.then( ( response: any ) => {
					if ( ! response.errors.length ) {
						$scope.requesting = false;
						$scope.requested = true;
					}
					$scope.loading = false;
				} );
		};

		$scope.submitReset = function() {
			Admin.login_errors = {};
			$scope.submitting = true;
			const req = {
				method: 'POST',
				url: localized.apiURL + '/admin/password-reset/submit',
				data: {
					code: $stateParams.code,
					auth: $stateParams.auth,
					password: $scope.password,
					password_confirmation: $scope.password_confirmation,
				},
			};

			Utils.getHttpPromise( req )
				.then( function( response: any ) {
					if ( ! response.errors.length ) {
						Admin.SetTokens( response.name, response.tokena, response.tokenb, false, response.token );
						Utils.setLocation( '/dashboard' );
					}
					$scope.submitting = false;
				} );
		};
	}
}() );

