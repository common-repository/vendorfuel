import angular from 'angular';
import template from './checkout-payment-square.component.html';
import { CheckoutService } from '../../../services/checkout.service';

declare const SqPaymentForm: any;

/**
 * Square Payment Gateway Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('checkoutPaymentSquare', {
		bindings: {
			orderId: '<',
			confirmedOrder: '<',
		},
		controller: SquareController,
		template,
	});

	SquareController.$inject = ['$scope', 'Alerts', 'Checkout', 'Localized'];

	function SquareController(
		$scope: ng.IScope,
		Alerts,
		Checkout: CheckoutService,
		Localized
	) {
		const vm = this;
		vm.$onInit = $onInit;

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.alertsList = Alerts.list;
			loadSquareUp();
		}

		/**
		 */
		function loadSquareUp() {
			const locationId = Localized.settings.square_location_id;
			vm.squareUpPaymentForm = new SqPaymentForm({
				// PRODUCTION APP ID:
				applicationId: 'sq0idp-XSN1fN7oGs4Q2Unob4UfSQ',

				// SANDBOX APP ID:
				// applicationId: 'sandbox-sq0idb-7JFysyB76m-8lyoWdvkp2Q',
				inputClass: 'sq-input',
				autoBuild: false,
				locationId,
				inputStyles: [
					{
						fontSize: '16px',
						lineHeight: '24px',
						padding: '16px',
						placeholderColor: '#a0a0a0',
						backgroundColor: 'transparent',
					},
				],
				cardNumber: {
					elementId: 'sq-card-number',
					placeholder: 'Card Number',
				},
				cvv: {
					elementId: 'sq-cvv',
					placeholder: 'CVV',
				},
				expirationDate: {
					elementId: 'sq-expiration-date',
					placeholder: 'MM/YY',
				},
				postalCode: {
					elementId: 'sq-postal-code',
					placeholder: 'Postal',
				},
				googlePay: {
					elementId: 'sq-google-pay',
				},
				callbacks: {
					cardNonceResponseReceived(errors, nonce, cardData) {
						vm.alertsList.splice(0, vm.alertsList.length);

						if (errors) {
							$scope.$apply(function () {
								errors.forEach(function (error, key) {
									Alerts.error(error.detail[key]);
								});
							});
							return;
						}

						vm.sqNonce = nonce;
						vm.paymentInfo = {
							ccType: cardData.card_brand,
							ccNum: 'XXXXXXXXXXXX-' + cardData.last_4,
						};
						completeOrder();
					},
					methodsSupported(methods) {
						const googlePayBtn =
							document.getElementById('sq-google-pay');
						if (methods.googlePay === true) {
							googlePayBtn.style.display = 'inline-block';
						}
					},
					createPaymentRequest() {
						const paymentRequestJson = {
							requestShippingAddress: true,
							requestBillingInfo: true,
							shippingContact: {
								familyName: vm.confirmedOrder.bill_last_name,
								givenName: vm.confirmedOrder.bill_first_name,
								email: vm.confirmedOrder.bill_email,
								country: 'USA',
								region: vm.confirmedOrder.bill_state,
								city: vm.confirmedOrder.bill_city,
								addressLines: [
									vm.confirmedOrder.bill_address1,
									vm.confirmedOrder.bill_address2,
								],
								postalCode: vm.confirmedOrder.bill_zip,
								phone: vm.confirmedOrder.bill_phone,
							},
							currencyCode: 'USD',
							countryCode: 'US',
							totalPriceStatus: 'FINAL',
							totalPrice: vm.confirmedOrder.data.order.total_amt,
							totalPriceLabel: 'Total',
							total: {
								label: Localized.settings.store.name,
								amount: vm.confirmedOrder.total_amt,
								pending: false,
							},
							lineItems: [
								{
									label: 'Subtotal',
									amount: vm.confirmedOrder.subtotal,
									pending: false,
								},
								{
									label: 'Shipping',
									amount: vm.confirmedOrder.shipping,
									pending: true,
								},
								{
									label: 'Tax',
									amount: vm.confirmedOrder.tax,
									pending: false,
								},
							],
						};

						return paymentRequestJson;
					},
				},
			});
			vm.squareUpPaymentForm.build();
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
				payment_method: 'squareup',
				cc_num: vm.paymentInfo.ccNum,
				cc_type: vm.paymentInfo.ccType,
				sq_nonce: vm.sqNonce,
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
})();
