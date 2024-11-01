import template from './cart-promo-code.component.html';

export const CartPromoCode: ng.IComponentOptions = {
	template,
	bindings: {
		promoCodes: '=',
		promoDiscount: '=',
		totalAmount: '=',
	},
	require: {
		cartController: '^cartComponent',
	},
	controller,
};

controller.$inject = ['Cart'];

function controller(Cart) {
	const vm = this;
	vm.addPromoCode = addPromoCode;
	vm.removePromoCode = removePromoCode;

	/**
	 * @function addPromoCode
	 * @param {string} code Promo code.
	 */
	function addPromoCode(code) {
		vm.isAddingPromoCode = true;
		Cart.addPromoCode(code)
			.then((response) => response.data)
			.then((data) => {
				if (!data.warnings.length && data.cart) {
					vm.promoCodes = data.cart.promo_codes;
					vm.promoDiscount = data.cart.promo_discount;
					vm.totalAmount = vm.cartController.toNumber(
						data.cart.total_amount
					);
				}
				vm.isAddingPromoCode = false;
				vm.code = '';
			})
			.catch(function (error) {
				console.error(error);
			});
	}

	/**
	 * @function removePromoCode
	 * @param {number} id Promo code ID.
	 */
	function removePromoCode(id) {
		vm.isRemovingPromoCode = true;

		Cart.removePromoCode(id)
			.then((response) => response.data)
			.then((data) => {
				if (!data.warnings.length && data.cart) {
					vm.promoCodes = data.cart.promo_codes;
					vm.promoDiscount = data.cart.promo_discount;
					vm.totalAmount = vm.cartController.toNumber(
						data.cart.total_amount
					);
					vm.isRemovingPromoCode = true;
				}
			});
	}
}
