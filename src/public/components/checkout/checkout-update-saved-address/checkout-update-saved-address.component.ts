import angular from 'angular';
import template from './checkout-update-saved-address.component.html';

angular.module('vfApp').component('checkoutUpdateSavedAddress', {
	template,
	bindings: {
		address: '<',
		isAddressBookUpdated: '=',
		form: '=',
		type: '@',
		handleChange: '&',
		handleSave: '&',
	},
	controller: CheckoutUpdatedSavedAddressController,
});

CheckoutUpdatedSavedAddressController.$inject = ['User'];

/**
 * @param {Object} User VendorFuel service
 */
function CheckoutUpdatedSavedAddressController(User) {
	const self = this;
	self.update = update;
	self.isAuthed = User.isAuthed;
	self.isGuest = User.isGuest;
	self.isUpdating = false;
	self.isUpdated = false;
	self.errors = [];

	this.$onInit = () => {
		// This component should only appear when the form from the parent component is changed.
		this.handleChange();
	};

	/**
	 * @function update
	 * @param {Object} address Profile address.
	 * @param {string} type    Expects 'shipping' or 'billing'.
	 * @param {Object} form    Form data.
	 */
	function update(address, type: 'billing' | 'shipping', form) {
		form.$setSubmitted();

		if (form.$valid) {
			self.isUpdating = true;
			self.errors = [];
			const updatedProfile = angular.copy(address);

			if (updatedProfile.state) {
				updatedProfile.state = updatedProfile.state.id;
			}

			// Reattach cached address ID which will update an address rather than create a new one.
			if (updatedProfile.cachedId) {
				if (type === 'billing') {
					updatedProfile.billing_id = updatedProfile.cachedId;
				} else {
					updatedProfile.shipping_id = updatedProfile.cachedId;
				}
				delete updatedProfile.cachedId;
			}

			if (type === 'shipping') {
				updatedProfile.shipping_name = updatedProfile.profileName;
				User.addShippingProfile(updatedProfile)
					.then((response) => {
						if (response.data.errors.length > 0) {
							self.errors = response.data.errors;
							self.isUpdating = false;
							self.isUpdated = true;
						} else {
							refreshState(form);
						}
					})
					.catch((error) => {
						console.error(error);
					});
			} else if (type === 'billing') {
				updatedProfile.billing_name = updatedProfile.profileName;
				User.addBillingProfile(updatedProfile)
					.then((response) => {
						if (response.data.errors.length > 0) {
							self.errors = response.data.errors;
							self.isUpdating = false;
							self.isUpdated = true;
						} else {
							refreshState(form);
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
		}
		this.handleSave();
	}

	/**
	 * @param {Object} form Form
	 */
	function refreshState(form) {
		self.address.isNewProfile = false;
		self.isAddressBookUpdated = new Date();
		self.isUpdating = false;
		self.isUpdated = true;
		form.$setPristine();
	}
}
