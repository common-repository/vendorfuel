import template from './page-heading.component.html';

export const PageHeading: ng.IComponentOptions = {
	bindings: {
		action: '<?',
		heading: '<',
		nav: '<?',
	},
	template,
};
