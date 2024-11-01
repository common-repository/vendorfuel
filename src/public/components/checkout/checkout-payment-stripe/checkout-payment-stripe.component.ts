import angular from 'angular';
import template from './checkout-payment-stripe.component.html';
import { CheckoutService } from '../../../services/checkout.service';

declare const Stripe: any;

angular.module('vfApp').component('checkoutPaymentStripe', {
	bindings: {
		orderId: '<',
	},
	controller: StripeController,
	template,
});

StripeController.$inject = ['$scope', 'Alerts', 'Checkout'];

function StripeController(
	$scope: ng.IScope,
	Alerts,
	Checkout: CheckoutService
) {
	const vm = this;
	vm.$onInit = $onInit;
	vm.isCardEntered = false;
	vm.isInProgress = false;
	vm.paymentInfo = {};
	vm.paymentMethod = 'stripe';
	vm.submit = submit;
	vm.alertsList = Alerts.list;

	/**
	 * @name $onInit
	 * @memberof Components.StripeController
	 */
	function $onInit() {
		const publishableKey = localized.settings.stripe_pk;

		if (localized.settings.stripe_enabled && publishableKey) {
			vm.stripe = Stripe(publishableKey);
			vm.elements = vm.stripe.elements();
			loadStripe();
		}
	}

	/**
	 * @name loadStripe
	 * @memberof Components.StripeController
	 */
	function loadStripe() {
		const options = {
			style: {
				base: {
					fontSize: '16px',
				},
			},
		};

		if (!vm.stripeCard) {
			vm.stripeCard = vm.elements.create('card', options);
			vm.stripeCard.mount('#card-element');
			vm.stripeCard.on('change', function (event) {
				if (event.complete) {
					$scope.$apply(function () {
						vm.isCardEntered = true;
					});
				} else {
					$scope.$apply(function () {
						vm.isCardEntered = false;
					});
				}
			});
		}
	}

	/**
	 * @name submit
	 * @memberof Components.StripeController
	 */
	function submit() {
		vm.isInProgress = true;
		vm.stripe
			.createToken(vm.stripeCard)
			.then((response) => {
				if (response.error) {
					$scope.$apply(function () {
						vm.alertsList.push({
							type: 'danger',
							msg: response.error.message,
						});
					});
				} else {
					vm.stripeToken = response.token.id;
					vm.paymentInfo.ccNum = response.token.card.last4;
					vm.paymentInfo.ccType = response.token.card.brand;
					completeOrder();
				}
			})
			.catch((error) => {
				console.error(error);
			});
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
			cc_num: vm.paymentInfo.ccNum,
			cc_type: vm.paymentInfo.ccType,
			stripe_token: vm.stripeToken,
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
