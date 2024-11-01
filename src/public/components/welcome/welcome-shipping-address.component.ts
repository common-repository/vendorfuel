import angular from 'angular';
import template from './welcome-shipping-address.component.html';

/**
 * Welcome Shipping Address
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('welcomeShippingAddress', {
		bindings: {
			onChange: '&',
		},
		controller: AddressController,
		template,
	});

	AddressController.$inject = ['Utils', 'User', 'usStates'];

	/**
	 * @param {Object} Utils    VendorFuel service
	 * @param {Object} User     VendorFuel service
	 * @param {Array}  usStates U.S. States
	 */
	function AddressController(Utils, User, usStates) {
		this.addressUrl = Utils.getPageUrl('addresses');
		this.usStates = usStates;

		/**
		 * Initialization
		 */
		this.$onInit = () => {
			this.form = {
				first_name: User.name.split(' ').shift(),
				last_name:
					User.name.split(' ').length > 1
						? User.name.split(' ').pop()
						: '',
				email: User.email,
			};
		};

		/**
		 * Gets the user's shipping profiles
		 */
		this.getShippingProfiles = () => {
			User.getProfiles()
				.then((response) => response.data)
				.then((data) => {
					const shippingAddresses = Object.values(
						data.shipping_addresses
					);
					if (shippingAddresses.length) {
						this.setDefaultShippingProfile(shippingAddresses[0]);
					}
				});
		};

		/**
		 * Saves the shipping profile
		 */
		this.save = () => {
			const profileForm = this.form;
			this.isSaving = true;

			User.addShippingProfile(profileForm)
				.then((response) => response.data)
				.then((data) => {
					if (!data.errors.length) {
						this.getShippingProfiles();
					}
				});
		};

		/**
		 * Sets the default shipping profile
		 *
		 * @param {Object} profile Shipping profile
		 */
		this.setDefaultShippingProfile = (profile) => {
			const { shipping_id: profileID } = profile;
			const type = 'shipping';

			User.setDefaultProfile(profileID, type)
				.then((response) => response.data)
				.then((data) => {
					if (!data.errors.length) {
						this.notification = data.notifications[0];
						this.isSaving = false;
						this.isSaved = true;
						this.onChange({});
					}
				});
		};
	}
})();
