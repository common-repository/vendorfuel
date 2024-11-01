( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.controller( 'TenantLoginController', TenantLoginController );

	TenantLoginController.$inject = [
		'$scope',
		'Tenant',
		'Utils',
		'Admin',
		'Debug',
	];

	/**
	 * @param {Object} $scope Angular service
	 * @param {Object} Tenant VendorFuel service
	 * @param {Object} Utils  VendorFuel service
	 * @param {Object} Admin  VendorFuel service
	 * @param {Object} Debug  VendorFuel service
	 */
	function TenantLoginController(
		$scope: any,
		Tenant: any,
		Utils: any,
		Admin: any,
		Debug: any,
	) {
		const parentCallback = $scope.$parent.LoginCallback;

		/**
		 * Initialization
		 */
		this.init = () => {
			Tenant.login_errors = {};
			Utils.redirecting = false;
			$scope.isAuthed = Admin.Authed();
			$scope.loginErrors = [];
			$scope.loggingIn = false;
			$scope.tenant = Tenant;
			$scope.user = { loginEmail: '', loginPassword: '' };
		};
		this.init();

		$scope.Login = function() {
			Tenant.login_errors = {};
			$scope.loggingIn = true;
			Tenant.Login( $scope.user.loginEmail, $scope.user.loginPassword ).then( function successCallback() {
				if ( parentCallback && Object.keys( Tenant.login_errors ).length === 0 ) {
					parentCallback();
				}
				if ( Object.keys( Tenant.login_errors ).length ) {
					$scope.loginErrors.push( Tenant.login_errors.toString() );
					Debug.error( $scope.loginErrors );
					Debug.error( Tenant.login_errors );
					$scope.loggingIn = false;
				}

				if ( Object.keys( Tenant.login_errors ).length === 0 ) {
					if ( Utils.ReturnLocation !== null ) {
						Utils.setLocation( Utils.ReturnLocation, false );
						Utils.redirecting = false;
						Utils.ReturnLocation = null;
					}
				}
			} );
		};

		$scope.ToggleShowPassword = function( type: string ) {
			if ( type === 'password' ) {
				$scope.showPassword = ! $scope.showPassword;
			}
		};
	}
}() );

