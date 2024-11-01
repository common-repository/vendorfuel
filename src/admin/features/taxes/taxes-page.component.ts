import template from './taxes-page.component.html';

export const TaxesPageComponent: ng.IComponentOptions = {
	controller: class Controller {
		public active: string;
		public tabs: { label: string; id: string }[];

		constructor() {
			this.tabs = [
				{ label: 'Options', id: 'options' },
				{ label: 'Avalara', id: 'avalara' },
			];
			this.active = this.tabs[0].id;
		}

		setActive(id: string) {
			this.active = id;
		}
	},
	template,
};
