import angular from 'angular';
import template from './checkout-payment-credit-line.component.html';
import { CheckoutService } from '../../../services/checkout.service';

angular.module('vfApp').component('checkoutPaymentCreditLine', {
	bindings: {
		orderId: '<',
	},
	controller: CreditLineController,
	template,
});

CreditLineController.$inject = ['Checkout'];

/**
 * @param {Object} Checkout VendorFuel service.
 */
function CreditLineController(Checkout: CheckoutService) {
	const vm = this;
	vm.isInProgress = false;
	vm.paymentInfo = {};
	vm.paymentMethod = 'credit_line';
	vm.submit = submit;

	/**
	 * @name submit
	 * @memberof Components.StripeController
	 */
	function submit() {
		completeOrder();
	}

	/**
	 * @name completeOrder
	 * @memberof Components.StripeController
	 */
	function completeOrder() {
		vm.isInProgress = true;
		vm.isComplete = false;
		const params = {
			order_id: vm.orderId,
			payment_method: vm.paymentMethod,
		};

		Checkout.completeOrder(params)
			.then((response: any) => {
				if (!response.data.errors.length) {
					disableNavWarning();
					vm.isPending = response.data.pending;
					vm.isComplete = true;
				}
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				vm.isInProgress = false;
			});
	}

	/**
	 * Prevents the user from navigating away from the page without a warning.
	 */
	function disableNavWarning() {
		window.onbeforeunload = null;
	}
}
