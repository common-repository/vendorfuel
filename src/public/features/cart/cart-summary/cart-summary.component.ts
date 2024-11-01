import template from './cart-summary.component.html';

export const CartSummary: ng.IComponentOptions = {
	template,
	bindings: {
		totalAmount: '<',
		cartCount: '<',
		cart: '<',
	},
	controller,
};

controller.$inject = ['Utils'];

function controller(Utils) {
	const vm = this;
	vm.$onInit = $onInit;

	function $onInit() {
		vm.pageUrls = {
			checkout: Utils.getPageUrl('checkout'),
		};
	}
}
