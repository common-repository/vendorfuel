import template from './accounts-settings.component.html';

export const AccountsSettings: ng.IComponentOptions = {
	template,
	controller: class AccountsSettingsController {
		static $inject = ['Settings'];

		breadcrumbs = [
			{ label: 'Customers', href: '?page=vf-customers' },
			{
				label: 'Accounts',
				href: '?page=vf-customers#/accounts',
			},
			{
				label: 'Settings',
				href: '?page=vendorfuel#!/customers/settings',
			},
		];
		settings: any;
		isLoading = true;

		constructor(private Settings: any) {
			this.settings = Settings;
		}

		$onInit() {
			this.getDefaultPrefix();
		}

		getDefaultPrefix() {
			this.Settings.store.Get().finally(() => {
				this.isLoading = false;
			});
		}

		update() {
			this.isLoading = true;
			this.Settings.store.Set().finally(() => {
				this.isLoading = false;
			});
		}
	},
};
