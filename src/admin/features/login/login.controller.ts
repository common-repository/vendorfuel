( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.controller( 'LoginController', LoginController );

	LoginController.$inject = [
		'$scope',
		'Admin',
		'Utils',
	];

	/**
	 * @param {Object} $scope Angular service
	 * @param {Object} Admin  VendorFuel service
	 * @param {Object} Utils  VendorFuel service
	 */
	function LoginController(
		$scope: any,
		Admin: any,
		Utils: any,
	) {
		const parentCallback = $scope.$parent.LoginCallback;

		this.init = () => {
			Admin.login_errors = {};
			Utils.redirecting = false;
			$scope.admin = Admin;
			$scope.loggingIn = false;
			$scope.remember_me = false;
			$scope.user = {
				loginEmail: '',
				loginPassword: '',
			};
		};
		this.init();

		$scope.trimExtraSp = ( str: string ) => {
			return str.replace( /\s+/g, '' );
		};

		$scope.Login = () => {
			Admin.login_errors = {};
			$scope.loggingIn = true;
			Admin.Login( $scope.user.loginEmail, $scope.trimExtraSp( $scope.user.loginPassword ), $scope.user.loginAuthenticator, $scope.remember_me )
				.then( () => {
					if ( parentCallback && Object.keys( Admin.login_errors ).length === 0 ) {
						parentCallback();
					}
					$scope.loggingIn = false;

					if ( Object.keys( Admin.login_errors ).length === 0 ) {
						this.isSignedIn = true;
						if ( ! Utils.ReturnLocation ) {
							const url = `${ location.pathname }?page=vf-dashboard`;
							window.location.assign( url );
						}
						if ( Utils.ReturnLocation !== null ) {
							Utils.setLocation( Utils.ReturnLocation, false );
							Utils.redirecting = false;
							Utils.ReturnLocation = null;
						}
					}
				} );
		};
		$scope.ToggleShowPassword = ( type: 'password' | 'conf' ) => {
			if ( type === 'password' ) {
				$scope.showPassword = ! $scope.showPassword;
			}
			if ( type === 'conf' ) {
				$scope.showPasswordConf = ! $scope.showPasswordConf;
			}
		};
	}
}() );

