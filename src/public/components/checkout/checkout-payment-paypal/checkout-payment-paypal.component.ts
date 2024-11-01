import angular from 'angular';
import template from './checkout-payment-paypal.component.html';
import { CheckoutService } from '../../../services/checkout.service';

declare const paypal: any;

angular.module('vfApp').component('checkoutPaymentPaypal', {
	bindings: {
		confirmedOrder: '<',
		paypalCreateOrder: '<',
		orderId: '<',
	},
	controller: PaypalController,
	template,
});

PaypalController.$inject = ['Checkout'];

function PaypalController(Checkout: CheckoutService) {
	const vm = this;
	vm.$onInit = $onInit;

	/**
	 */
	function $onInit() {
		loadPaypal();
	}

	/**
	 */
	function loadPaypal() {
		const element = '#paypal-button-container';
		paypal
			.Buttons({
				createOrder(data, actions) {
					return vm.paypalCreateOrder.id;
				},
				onApprove(data, actions) {
					vm.paypal_order_id = data.orderID;
					vm.payment_method = 'paypal_checkout';
					completeOrder();
				},
			})
			.render(element);
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
			payment_method: 'paypal_checkout',
			paypal_order_id: vm.paypal_order_id,
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
