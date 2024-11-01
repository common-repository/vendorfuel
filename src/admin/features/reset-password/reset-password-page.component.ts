import template from './reset-password-page.component.html';

export const ResetPasswordPage: ng.IComponentOptions = {
	controller: class Controller {
		static $inject = [
			'$http',
			'$location',
			'$stateParams',
			'Admin',
			'Utils',
		];

		password = '';
		password_confirmation = '';
		isBusy = false;
		resetEmail: null | string = null;
		showPassword = false;
		showPasswordConfirmation = false;
		resetting: boolean;

		constructor(
			private $http: ng.IHttpService,
			private $location: ng.ILocationService,
			private $stateParams: ng.ui.IStateParamsService,
			private Admin: any,
			private Utils: any
		) {
			this.Utils.redirecting = false;
		}

		$onInit() {
			if (this.$stateParams.code && this.$stateParams.auth) {
				this.resetting = true;
			}
		}

		toggleShowPassword() {
			this.showPassword = !this.showPassword;
		}

		toggleShowPasswordConfirmation() {
			this.showPasswordConfirmation = !this.showPasswordConfirmation;
		}

		requestReset() {
			this.isBusy = true;
			const url = `${localized.apiURL}/admin/password-reset/request`;
			const data = {
				email: this.resetEmail,
				url: this.$location.absUrl(),
			};

			this.$http
				.post(url, data)
				.then((response) => response.data)
				.then((responseData: { errors?: string[] }) => {
					if (!responseData.errors.length) {
						this.isBusy = false;
					}
				});
		}

		submitReset() {
			this.isBusy = true;
			const url = `${localized.apiURL}/admin/password-reset/submit`;
			const data = {
				code: this.$stateParams.code,
				auth: this.$stateParams.auth,
				password: this.password,
				password_confirmation: this.password_confirmation,
			};

			this.$http
				.post(url, data)
				.then((response) => response.data)
				.then(
					(responseData: {
						errors?: string[];
						name: string;
						tokena: string;
						tokenb: string;
						token: unknown;
					}) => {
						if (!responseData.errors.length) {
							this.Admin.SetTokens(
								responseData.name,
								responseData.tokena,
								responseData.tokenb,
								false,
								responseData.token
							);
							location.assign('?page=vf-admin');
						}
						this.isBusy = false;
					}
				);
		}
	},
	template,
};
