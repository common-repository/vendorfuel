import angular from 'angular';
import template from './checkout-address-book.component.html';

angular.module('vfApp').component('checkoutAddressBook', {
	bindings: {
		address: '=',
		type: '@',
		isAddressBookUpdated: '<',
		isLocked: '<',
		onSelect: '&',
	},
	template,
	controller: AddressBookController,
});

AddressBookController.$inject = ['User', 'usStates'];

/**
 * @param {Object} User     VendorFuel service
 * @param {Array}  usStates U.S. states
 */
function AddressBookController(User, usStates) {
	const vm = this;

	vm.isConfirmingProfileDeletion = [];
	vm.isAuthed = User.isAuthed;
	vm.isGuest = User.isGuest;
	vm.deleteProfile = deleteProfile;
	vm.isSelected = [];
	vm.setDefaultProfile = setDefaultProfile;

	vm.status = {
		setDefault: [],
		update: [],
		delete: [],
	};

	vm.$onInit = function () {
		vm.defaultId = getDefaultProfileId(vm.type);
		vm.isOnInit = true;
		getProfiles();
	};

	vm.$onChanges = function (changes) {
		if (
			changes.isAddressBookUpdated &&
			changes.isAddressBookUpdated.currentValue
		) {
			getProfiles();
		}
	};

	/**
	 * @param {string} type Expects 'shipping' or 'billing'.
	 * @return {number} Default profile ID.
	 */
	function getDefaultProfileId(type) {
		return type === 'shipping'
			? User.defaultShippingProfile
			: User.defaultBillingProfile;
	}

	/**
	 * @return {Object} Address profile.
	 */
	function getDefaultProfile() {
		return vm.profiles.find((element) => element.id === vm.defaultId);
	}

	/**
	 * @function selectProfile
	 * @param {Object} profile Address profile
	 * @param {string} type    Expects 'shipping' or 'billing'.
	 * @param {number} index   Index
	 */
	this.selectProfile = (profile, type, index) => {
		profile.isNewProfile = false;
		vm.isSelected.fill(false);
		vm.isSelected[index] = true;
		setAddressForm(profile);
		this.onSelect();
	};

	/**
	 * @function setAddressForm
	 * @param {Object} profile Address profile.
	 */
	function setAddressForm(profile) {
		vm.profileName = profile.profileName;
		const contactKeys = ['first_name', 'last_name', 'email', 'phone'];

		Object.entries(profile).forEach((field) => {
			const [key, newValue] = field;
			if (key !== 'state') {
				if (contactKeys.includes(key)) {
					vm.address[key] = newValue || vm.address[key];
				} else {
					vm.address[key] = newValue;
				}
			} else {
				vm.address[key] = Object.values(usStates).find(
					(state) => state.id === newValue.toLocaleUpperCase()
				);
			}
		});
		vm.address.isFromProfile = true;
	}

	/**
	 * @function getProfiles
	 */
	function getProfiles() {
		vm.isLoading = true;
		User.getProfiles().then(function (resp) {
			vm.profiles =
				vm.type === 'shipping'
					? Object.values(resp.data.shipping_addresses)
					: Object.values(resp.data.billing_addresses);
			vm.profiles.forEach(function (element) {
				element.profileName =
					element.shipping_name || element.billing_name;
				element.id = element.shipping_id || element.billing_id;
			});

			if (vm.defaultId && getDefaultProfile()) {
				vm.profiles = getDefaultFirst(vm.profiles, vm.defaultId);
			}

			if (vm.isOnInit) {
				if (getDefaultProfile()) {
					setAddressForm(getDefaultProfile());
					vm.isSelected[0] = true;
				}
				vm.isOnInit = false;
			}
			vm.isLoading = false;
		});
	}

	/**
	 * @param {Array}  profiles  Address profiles.
	 * @param {number} defaultId Default profile ID.
	 * @return {Array} Profiles with default first in index.
	 */
	function getDefaultFirst(profiles, defaultId) {
		const defaultProfile = profiles.find(
			(element) => element.id === defaultId
		);

		profiles.splice(
			profiles.findIndex((element) => element.id === defaultId),
			1
		);
		profiles.unshift(defaultProfile);
		return profiles;
	}

	this.createProfile = () => {
		vm.address = {
			isNewProfile: true,
		};
		this.onSelect();
	};

	/**
	 * @function setDefaultProfile
	 * @param {number} id    Profile ID.
	 * @param {string} type  Expects 'shipping' or 'billing'.
	 * @param {number} index Index.
	 */
	function setDefaultProfile(id, type, index) {
		vm.status.setDefault[index] = true;
		User.setDefaultProfile(id, type).then(function () {
			vm.defaultId = id;
			vm.status.setDefault[index] = false;
		});
	}

	/**
	 * @function deleteProfile
	 * @param {number} id    Profile ID.
	 * @param {string} type  Expects 'shipping' or 'billing'.
	 * @param {number} index Index.
	 */
	function deleteProfile(id, type, index) {
		vm.status.delete[index] = true;

		if (type === 'shipping') {
			User.removeShippingProfile(id).then(function () {
				refreshProfileState(index);
			});
		} else if (type === 'billing') {
			User.removeBillingProfile(id).then(function () {
				refreshProfileState(index);
			});
		}
	}

	/**
	 * @function refreshProfileState
	 * @param {number} index Index.
	 */
	function refreshProfileState(index) {
		vm.status.delete[index] = false;
		vm.isConfirmingProfileDeletion[index] = false;
		vm.isSelected[index] = false;
		vm.profiles.splice(index, 1);
	}
}
