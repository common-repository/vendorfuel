import template from './layout.component.html';
import type { Localized } from '../types';
declare const localized: Localized;

export const Layout: ng.IComponentOptions = {
	bindings: {
		hideAlertList: '<',
	},
	controller: class Controller {
		public hasAPIKey: boolean;
		constructor() {
			this.hasAPIKey = localized.settings.general.api_key ? true : false;
		}
	},
	template,
	transclude: true,
};
