import template from './login-page.component.html';

export const LoginPage: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$scope', 'Admin', 'Utils'];

function controller($scope: ng.IScope, Admin: any, Utils: any) {
	const parentCallback = $scope.$parent.LoginCallback;
	this.isSSL = location.protocol === 'https:' ? true : false;

	this.$onInit = () => {
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

	$scope.trimExtraSp = (str: string) => {
		return str.replace(/\s+/g, '');
	};

	$scope.Login = () => {
		Admin.login_errors = {};
		$scope.loggingIn = true;
		Admin.Login(
			$scope.user.loginEmail,
			$scope.trimExtraSp($scope.user.loginPassword),
			$scope.user.loginAuthenticator,
			$scope.remember_me
		).then(() => {
			if (
				parentCallback &&
				Object.keys(Admin.login_errors).length === 0
			) {
				parentCallback();
			}
			$scope.loggingIn = false;

			if (Object.keys(Admin.login_errors).length === 0) {
				this.isSignedIn = true;
				if (!Utils.ReturnLocation) {
					const url = `${location.pathname}?page=vf-admin`;
					window.location.assign(url);
				}
				if (Utils.ReturnLocation !== null) {
					Utils.setLocation(Utils.ReturnLocation, false);
					Utils.redirecting = false;
					Utils.ReturnLocation = null;
				}
			}
		});
	};
}
