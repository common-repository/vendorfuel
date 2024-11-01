import template from './tenant-login-page.component.html';

export const TenantLoginPage: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = ['$scope', 'Tenant', 'Utils', 'Admin', 'Debug'];

function controller(
	$scope: ng.IScope,
	Tenant: any,
	Utils: any,
	Admin: any,
	Debug: any
) {
	const parentCallback = $scope.$parent.LoginCallback;

	/**
	 * Initialization
	 */
	this.$onInit = () => {
		Tenant.login_errors = {};
		Utils.redirecting = false;
		$scope.isAuthed = Admin.Authed();
		$scope.loginErrors = [];
		$scope.loggingIn = false;
		$scope.tenant = Tenant;
		$scope.user = { loginEmail: '', loginPassword: '' };
	};

	$scope.Login = () => {
		Tenant.login_errors = {};
		$scope.loggingIn = true;
		Tenant.Login($scope.user.loginEmail, $scope.user.loginPassword).then(
			() => {
				if (
					parentCallback &&
					Object.keys(Tenant.login_errors).length === 0
				) {
					parentCallback();
				}
				if (Object.keys(Tenant.login_errors).length) {
					$scope.loginErrors.push(Tenant.login_errors.toString());
					Debug.error($scope.loginErrors);
					Debug.error(Tenant.login_errors);
					$scope.loggingIn = false;
				}

				if (Object.keys(Tenant.login_errors).length === 0) {
					if (Utils.ReturnLocation !== null) {
						Utils.setLocation(Utils.ReturnLocation, false);
						Utils.redirecting = false;
						Utils.ReturnLocation = null;
					}
				}
			}
		);
	};

	$scope.ToggleShowPassword = (type: string) => {
		if (type === 'password') {
			$scope.showPassword = !$scope.showPassword;
		}
	};
}
