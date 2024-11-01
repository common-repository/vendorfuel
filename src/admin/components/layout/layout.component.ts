import template from './layout.component.html';

export const Layout: ng.IComponentOptions = {
	bindings: {
		action: '<?',
		breadcrumbs: '<?',
		heading: '@',
		nav: '<?',
	},
	controller: class Controller {},
	template,
	transclude: true,
};
