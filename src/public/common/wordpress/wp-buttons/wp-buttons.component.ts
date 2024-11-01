import template from './wp-buttons.html';

export const WpButtonsComponent: ng.IComponentOptions = {
	bindings: {
		isVertical: '<',
		justification: '@',
	},
	template,
	transclude: true,
};
