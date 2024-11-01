import template from './billing-reset-password-page.component.html';

export const BillingResetPasswordPage: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'Admin',
	'Utils',
	'$location',
	'$stateParams',
	'Debug',
];

function controller(
	$scope: ng.IScope,
	Admin: any,
	Utils: any,
	$location: ng.ILocationService,
	$stateParams: ng.ui.IStateParamsService,
	Debug: any
) {
	this.$onInit = () => {
		Admin.login_errors = {};
		Utils.redirecting = false;

		$scope.isAuthed = Admin.Authed();
		$scope.password = '';
		$scope.password_confirmation = '';
		$scope.requesting = false;
		$scope.resetEmail = null;
		$scope.showPassword = false;
		$scope.showPasswordConfirmation = false;

		if ($stateParams.code && $stateParams.auth) {
			$scope.reseting = true;
		}
	};

	$scope.trimExtraSp = (str: string) => str.replace(/\s+/g, '');

	$scope.ToggleShowPassword = () => {
		$scope.showPassword = !$scope.showPassword;
	};
	$scope.ToggleShowPasswordConfirmation = () => {
		$scope.showPasswordConfirmation = !$scope.showPasswordConfirmation;
	};

	$scope.requestReset = () => {
		Admin.login_errors = {};
		$scope.requesting = true;
		const req = {
			method: 'POST',
			url: localized.apiURL + '/tenant/password/request',
			data: { email: $scope.resetEmail, url: $location.absUrl() },
		};

		Utils.getHttpPromise(req)
			.then(
				() => {
					$scope.requested = true;
					$scope.requesting = false;
				},
				() => {}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	$scope.submitReset = () => {
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

		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					Admin.SetTokens(
						resp.name,
						resp.tokena,
						resp.tokenb,
						false,
						resp.token
					);
					Utils.setLocation('/dashboard');
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.submitting = false;
			});
	};
}
