import template from './settings-page.component.html';

export const SettingsPage: ng.IComponentOptions = {
	controller: class Controller {
		static $inject: string[] = ['Admin', 'Localized'];

		public active: string;
		public hasAPIKey: boolean;
		public isAuthed: boolean;
		public tabs = [
			{ label: 'General', id: 'general', protected: false },
			{ label: 'Store', id: 'store', protected: true },
			{ label: 'Analytics', id: 'analytics', protected: true },
			{ label: 'Page Mapping', id: 'mapping', protected: true },
		];

		constructor(Admin: any, Localized: any) {
			this.isAuthed = Admin.Authed();
			this.hasAPIKey = Localized.api_key ? true : false;
			this.active = this.tabs[0].id;
		}

		setActive(id: string) {
			this.active = id;
		}
	},
	template,
};
