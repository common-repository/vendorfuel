import template from './checkout-billing-address.component.html';
import { emailPattern } from '../../../common/patterns';
declare const angular: ng.IAngularStatic;

angular
	.module( 'vfApp' )
	.component( 'checkoutBillingAddress', {
		template,
		require: {
			checkoutCtrl: '^vfCheckout',
		},
		bindings: {
			billingAddress: '=',
			shippingAddress: '<',
			isBillingComplete: '=',
		},
		controller: BillingAddressController,
	} );

BillingAddressController.$inject = [
	'User',
	'usStates',
];

/**
 * @param {Object} User     VendorFuel service
 * @param {Array}  usStates U.S. states
 */
function BillingAddressController(
	User,
	usStates,
) {
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
		if ( this.billingAddress.cachedId ) {
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

	/**
	 * @function $onInit
	 */
	vm.$onInit = () => {
		const el = jQuery( '#saved-billing-addresses' );
		el.collapse( {
			toggle: false,
		} );
	};

	/**
	 * @function toggleShowSavedAddresses
	 */
	vm.toggleShowSavedAddresses = () => {
		const el = jQuery( '#saved-billing-addresses' );
		el.collapse( 'toggle' );
		vm.isShowingSavedAddresses = ! vm.isShowingSavedAddresses;
	};

	/**
	 * @function confirmBillingAddress
	 * @param {Object} form Form data.
	 */
	function confirmBillingAddress( form ) {
		form.$setSubmitted();
		if ( form.$valid ) {
			vm.isBillingComplete = true;
			setTimeout( function() {
				vm.checkoutCtrl.showTab( 'delivery' );
			}, 500 );
		}
	}
}

