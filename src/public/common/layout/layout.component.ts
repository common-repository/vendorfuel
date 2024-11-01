import template from './layout.component.html';
import type { Localized } from '../../types';
declare const localized: Localized;

export const Layout: ng.IComponentOptions = {
	controller: class Controller {
		public hasAPIKey: boolean = localized.settings.general.api_key
			? true
			: false;
		constructor() {}
	},
	template,
	transclude: true,
};
