import angular from 'angular';
import template from './checkout-shipping-method.component.html';
import { CheckoutService } from '../../services/checkout.service';

export const CheckoutShippingMethod: ng.IComponentOptions = {
	template,
	require: {
		checkoutCtrl: '^vfCheckout',
	},
	bindings: {
		orderId: '<',
		zipcode: '<',
		selectedShippingMethod: '=',
		isBillingComplete: '<',
		isShippingComplete: '<',
		isDeliveryComplete: '=',
		isReadyToConfirm: '=',
		isShippingSameAsBilling: '<',
		hasAdditionalInfo: '<',
		shippingMethods: '<',
	},
	controller,
};

controller.$inject = ['Alerts', 'Checkout'];

function controller(Alerts, Checkout: CheckoutService) {
	const vm = this;
	vm.isLoading = false;
	vm.confirmDeliveryMethod = confirmDeliveryMethod;
	vm.setShippingMethod = setShippingMethod;
	vm.isSelected = [];
	vm.$onChanges = $onChanges;

	/**
	 * @name $onChanges
	 * @param {Object} changes Model changes.
	 * @memberof Components.ShippingMethodController
	 */
	function $onChanges(changes) {
		if (
			changes.isBillingComplete &&
			changes.isBillingComplete.currentValue
		) {
			getShippingMethods();
		}
	}

	/**
	 * @name getShippingMethods
	 */
	function getShippingMethods() {
		vm.isLoading = true;
		const { orderId, zipcode } = vm;
		const profileId = null;

		Checkout.getShippingMethods(orderId, profileId, zipcode)
			.then((resolve) => resolve.data)
			.then((data: any) => {
				if (!data.errors.length) {
					vm.shippingMethods = data.shipping_methods;
					if (vm.shippingMethods.length === 1) {
						vm.setShippingMethod(
							vm.shippingMethods[0].id,
							vm.shippingMethods[0].shipping_method,
							0
						);
					}
				}
				vm.isLoading = false;
			});
	}

	/**
	 * @name setShippingMethod
	 * @param {number} id             Shipping method ID.
	 * @param {Object} shippingMethod Shipping method
	 * @param {number} index          Index
	 * @memberof Components.ShippingMethodController
	 */
	function setShippingMethod(id, shippingMethod, index) {
		vm.isSelected.fill(false);
		vm.selectedShippingMethod = id || shippingMethod;
		vm.isSelected[index] = true;
	}

	/**
	 * @name confirmDeliveryMethod
	 * @memberof Components.ShippingMethodController
	 */
	function confirmDeliveryMethod() {
		let nextTab = 'review';
		if (vm.selectedShippingMethod) {
			vm.isReadyToConfirm = true;
			vm.isDeliveryComplete = true;
			setTimeout(function () {
				if (vm.hasAdditionalInfo) {
					nextTab = 'additional';
				}
				vm.checkoutCtrl.showTab(nextTab);
			}, 500);
		} else {
			Alerts.warning('Please choose a delivery method.');
		}
	}
}
