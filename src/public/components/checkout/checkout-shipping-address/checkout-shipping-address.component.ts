import template from './checkout-shipping-address.component.html';
import { emailPattern } from '../../../common/patterns';
declare const angular: ng.IAngularStatic;

angular
	.module( 'vfApp' )
	.component( 'checkoutShippingAddress', {
		template,
		require: {
			checkoutCtrl: '^vfCheckout',
		},
		bindings: {
			billingAddress: '=',
			isBillingComplete: '=',
			isShippingComplete: '=',
			isShippingSameAsBilling: '=',
			shippingAddress: '=',
		},
		controller: ShippingAddressController,
	} );

ShippingAddressController.$inject = [
	'User',
	'usStates',
];

/**
 * @param {Object} User     VendorFuel service
 * @param {Array}  usStates U.S. states
 */
function ShippingAddressController(
	User,
	usStates,
) {
	const vm = this;
	this.emailPattern = emailPattern;
	this.onSelectedAddress = () => {
		vm.toggleShowSavedAddresses();
	};

	this.handleChange = () => {
		// Detach address ID to prevent overwriting a modified address during checkout confirmation.
		this.shippingAddress.cachedId = this.shippingAddress.id;
		delete this.shippingAddress.id;
		delete this.shippingAddress.shipping_id;
	};

	this.handleSave = () => {
		// Reattach cached address ID to pass along to checkout confirmation.
		if ( this.shippingAddress.cachedId ) {
			this.shippingAddress.id = this.shippingAddress.cachedId;
			this.shippingAddress.shipping_id = this.shippingAddress.cachedId;
			delete this.shippingAddress.cachedId;
		}
	};

	vm.isShowingSavedAddresses = false;
	vm.confirmAddress = confirmAddress;
	vm.confirmShippingAddress = confirmShippingAddress;
	vm.defaultShippingProfileId = User.defaultShippingProfile || 0;
	vm.isAuthed = User.isAuthed;
	vm.isCreatingProfile = [];
	vm.isDeleted = false;
	vm.isGuest = User.isGuest;
	vm.isSelectedProfile = [];
	vm.stateOptions = usStates;
	vm.status = {
		setDefault: [],
		update: [],
		delete: [],
	};

	/**
	 * @function $onInit
	 */
	vm.$onInit = () => {
		vm.hasLockedBilling = vm.checkoutCtrl.hasLockedBilling;

		const el = jQuery( '#saved-shipping-addresses' );
		el.collapse( {
			toggle: false,
		} );
	};

	/**
	 * @function toggleShowSavedAddresses
	 */
	vm.toggleShowSavedAddresses = () => {
		const el = jQuery( '#saved-shipping-addresses' );
		el.collapse( 'toggle' );
		vm.isShowingSavedAddresses = ! vm.isShowingSavedAddresses;
	};

	/**
	 * @function confirmShippingAddress
	 * @param {Object} form Form data.
	 */
	function confirmShippingAddress( form ) {
		form.$setSubmitted();
		if ( form.$valid ) {
			vm.isShippingComplete = true;
			setTimeout( function() {
				vm.checkoutCtrl.showTab( 'billing' );
			}, 500 );
		}
	}

	/**
	 * @function confirmAddress
	 * @param {Object} form Form data.
	 * @description When user is using the same address for shipping and billing.
	 */
	function confirmAddress( form ) {
		form.$setSubmitted();
		if ( form.$valid ) {
			vm.isShippingComplete = true;
			vm.isBillingComplete = true;
			setTimeout( function() {
				vm.checkoutCtrl.showTab( 'delivery' );
			}, 500 );
		}
	}
}

