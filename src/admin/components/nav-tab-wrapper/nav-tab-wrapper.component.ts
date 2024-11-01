import template from './nav-tab-wrapper.component.html';

export const NavTabWrapper: ng.IComponentOptions = {
	bindings: {
		active: '<',
		authed: '<',
		handleChange: '&',
		tabs: '<',
	},
	controller: class Controller {
		active: string;
		authed: boolean;
		handleChange: ({ id }: { id: string }) => void;
		tab: string;

		handleClick(id: string) {
			this.handleChange({ id });
		}
	},
	template,
};
