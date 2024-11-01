import angular from 'angular';
import template from './checkout-payment-authnet.component.html';
import { CheckoutService } from '../../../services/checkout.service';

declare const Accept: any;

angular.module('vfApp').component('checkoutPaymentAuthnet', {
	bindings: {
		confirmedOrder: '<',
		orderId: '<',
	},
	controller: AuthnetController,
	template,
});

AuthnetController.$inject = ['Alerts', 'Checkout', 'Localized'];

function AuthnetController(Alerts, Checkout: CheckoutService, Localized) {
	const vm = this;
	vm.errors = [];
	vm.$onInit = $onInit;
	vm.sendPaymentDataToAnet = sendPaymentDataToAnet;

	/**
	 * Initialization
	 */
	function $onInit() {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth();
		const range = [];
		range.push(year);
		for (let i = 1; i < 10; i++) {
			range.push(year + i);
		}
		vm.month = month + 1;
		vm.year = year;
		vm.years = range;
	}

	/**
	 */
	function sendPaymentDataToAnet() {
		vm.isInProgress = true;
		const secureData = {
			authData: {
				clientKey: Localized.settings.authnet_public_key,
				apiLoginID: Localized.settings.authnet_id,
			},
			cardData: {
				cardNumber: vm.card.number,
				month: vm.card.expMonth.toString(),
				year: vm.card.expYear.toString(),
				cardCode: vm.card.cardCode.toString(),
				zip: vm.card.postalCode.toString(),
			},
		};

		Accept.dispatchData(secureData, responseHandler);
	}

	/**
	 * @param {Object} response Response.
	 */
	function responseHandler(response) {
		if (response.messages.resultCode === 'Error') {
			response.messages.message.forEach(function (message) {
				console.error(message);
				Alerts.error(message.text);
			});
			vm.isInProgress = false;
		} else {
			vm.opaqueDataDescriptor = response.opaqueData.dataDescriptor;
			vm.opaqueDataValue = response.opaqueData.dataValue;
			vm.paymentInfo = {
				ccNum: vm.card.number.replace(/\d(?=\d{4})/g, 'X'),
			};
			completeOrder();
		}
	}

	/**
	 * @name completeOrder
	 */
	function completeOrder() {
		vm.isComplete = false;
		const params = {
			order_id: vm.orderId,
			payment_method: 'authnet',
			cc_num: vm.paymentInfo.ccNum,
			opaqueDataDescriptor: vm.opaqueDataDescriptor,
			opaqueDataValue: vm.opaqueDataValue,
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
