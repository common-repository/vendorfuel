import template from './checkout-billing-address.component.html';
import { emailPattern } from '../../common/patterns';

export const CheckoutBillingAddress: ng.IComponentOptions = {
	template,
	require: {
		checkoutCtrl: '^vfCheckout',
	},
	bindings: {
		billingAddress: '=',
		shippingAddress: '<',
		isBillingComplete: '=',
	},
	controller,
};

controller.$inject = ['User', 'usStates'];

/**
 * @param {Object} User     VendorFuel service
 * @param {Array}  usStates U.S. states
 */
function controller(User, usStates) {
	const vm = this;
	this.emailPattern = emailPattern;

	this.handleChange = () => {
		// Detach address ID to prevent overwriting a modified address during checkout confirmation.
		this.billingAddress.cachedId = this.billingAddress.id;
		delete this.billingAddress.id;
		delete this.billingAddress.billing_id;
	};

	this.handleSave = () => {
		// Reattach cached address ID to pass along to checkout confirmation.
		if (this.billingAddress.cachedId) {
			this.billingAddress.id = this.billingAddress.cachedId;
			this.billingAddress.billing_id = this.billingAddress.cachedId;
			delete this.billingAddress.cachedId;
		}
	};

	this.onSelectedAddress = () => {
		vm.toggleShowSavedAddresses();
	};

	vm.isShowingSavedAddresses = false;

	vm.confirmBillingAddress = confirmBillingAddress;
	vm.defaultBillingProfileId = User.defaultBillingProfile || 0;
	vm.isAuthed = User.isAuthed;
	vm.isDeleted = false;
	vm.isGuest = User.isGuest;
	vm.isSelectedProfile = [];
	vm.isCreatingProfile = [];
	vm.status = {
		setDefault: [],
		update: [],
		delete: [],
	};
	vm.stateOptions = usStates;

	vm.toggleShowSavedAddresses = () => {
		vm.isShowingSavedAddresses = !vm.isShowingSavedAddresses;
	};

	/**
	 * @function confirmBillingAddress
	 * @param {Object} form Form data.
	 */
	function confirmBillingAddress(form) {
		form.$setSubmitted();
		if (form.$valid) {
			vm.isBillingComplete = true;
			setTimeout(function () {
				vm.checkoutCtrl.showTab('delivery');
			}, 500);
		}
	}
}
