import angular from 'angular';
import template from './checkout-payment-qualpay.component.html';
import { CheckoutService } from '../../../services/checkout.service';

declare const qpEmbeddedForm: any;

angular.module('vfApp').component('checkoutPaymentQualpay', {
	bindings: {
		confirmedOrder: '<',
		orderId: '<',
		qualpay: '<',
	},
	controller: QualpayController,
	template,
});

QualpayController.$inject = ['$scope', 'Cart'];

function QualpayController($scope: ng.IScope, Checkout: CheckoutService) {
	const vm = this;
	vm.$onInit = $onInit;

	/**
	 * Initalization.
	 */
	function $onInit() {
		loadQualpay();
	}

	/**
	 */
	function loadQualpay() {
		qpEmbeddedForm.loadFrame(vm.qualpay.merchantId, {
			formId: 'my-payment-form',
			transientKey: vm.qualpay.transientKey,
			tokenize: false,
			onSuccess(data) {
				$scope.$apply(function () {
					vm.errors = [];
				});

				vm.qualpayCardId = data.card_id;
				vm.paymentInfo = {
					ccType: data.card_type,
					ccNum: data.card_number,
				};
				completeOrder();
			},
			onError(error) {
				$scope.$apply(function () {
					vm.errors = [];
				});
				if (error.detail) {
					$scope.$apply(function () {
						for (const key in error.detail) {
							if (key) {
								vm.errors.push(error.detail[key]);
							}
						}
					});
				}
			},
			achConfig: {
				enabled: true,
				onPaymentTypeChange(data) {
					angular.noop(data);
				},
			},
			formFields: {
				cvv2: {
					required: true,
				},
			},
			font: 'Titillium Web',
			paymentRequestConfig: {
				paymentDetails: {
					total: {
						label: 'Total',
						amount: {
							currency: 'USD',
							value: vm.confirmedOrder.total_amt,
						},
					},
					displayItems: [
						{
							label: 'Tax',
							amount: {
								currency: 'USD',
								value: vm.confirmedOrder.tax,
							},
						},
						{
							label: 'Shipping',
							amount: {
								currency: 'USD',
								value: vm.confirmedOrder.shipping,
							},
						},
						{
							label: 'Discount',
							amount: {
								currency: 'USD',
								value: -vm.confirmedOrder.promo_discount,
							},
						},
						{
							label: 'Subtotal',
							amount: {
								currency: 'USD',
								value: vm.confirmedOrder.subtotal,
							},
						},
					],
				},
				options: {
					requestPayerName: true,
					requestPayerPhone: true,
					requestPayerEmail: true,
					requestShipping: true,
					shippingType: 'shipping|delivery|pickup',
				},
			},
		});
	}

	/**
	 * @name completeOrder
	 */
	function completeOrder() {
		vm.isInProgress = true;
		vm.isComplete = false;
		const params = {
			order_id: vm.orderId,
			payment_method: 'qualpay',
			cc_num: vm.paymentInfo.ccNum,
			cc_type: vm.paymentInfo.ccType,
			qualpay_card_id: vm.qualpayCardId,
			qualpay_merchant_id: vm.qualpay.merchantId,
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
