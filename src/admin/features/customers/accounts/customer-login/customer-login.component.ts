import template from './customer-login.html';

export const CustomerLoginComponent: ng.IComponentOptions = {
	bindings: {
		customerId: '<',
	},
	template,
	controller: class CustomerLoginController {
		static $inject: string[] = ['CustomerLoginService'];

		customerId: number;
		isLoading: boolean;

		constructor(private CustomerLoginService: any) {}

		login() {
			this.isLoading = true;
			this.CustomerLoginService.login(this.customerId).then(() => {
				this.isLoading = false;
				this.CustomerLoginService.openNewTab();
			});
		}
	},
};
