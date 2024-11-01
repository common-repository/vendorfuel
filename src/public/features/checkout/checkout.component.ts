import template from './checkout.component.html';
import { CheckoutService } from '../../services/checkout.service';

class ExtraField {
	autocomplete: string;
	isRequired: boolean;
	label: string;
	value: string | Array<string>;
	constructor(
		label: string,
		isRequired = false,
		value = '',
		autocomplete = 'off'
	) {
		this.label = label;
		this.value = value;
		this.isRequired = isRequired;
		this.autocomplete = autocomplete;
	}
}

export const CheckoutComponent: ng.IComponentOptions = {
	bindings: {
		poPrefix: '@',
	},
	template,
	controller,
};

controller.$inject = ['$cookies', '$location', 'Checkout', 'User', 'Utils'];

function controller(
	$cookies: ng.cookies.ICookiesService,
	$location: ng.ILocationService,
	Checkout: CheckoutService,
	User,
	Utils
) {
	const vm = this;
	this.hasAPIKey = localized.settings.general.api_key;
	this.pageUrls = {
		catalog: Utils.getPageUrl('catalog'),
		login: Utils.getPageUrl('login', {
			redirect_to: $location.path(),
		}),
		register: Utils.getPageUrl('register'),
		savedCarts: Utils.getPageUrl('saved-carts'),
	};

	this.$onInit = () => {
		if (this.hasAPIKey && User.isAuthed) {
			setAddresses();

			vm.productSlug =
				localized.settings.general.product_slug || 'products';
			vm.isSignedIn = User.isAuthed && User.email;
			this.getCheckout();
		}
	};

	this.$onChanges = () => {
		// Change PO Prefix to empty if the default value isn't replaced by a value set in the template shortcode.
		if (this.poPrefix === 'PO_PREFIX') {
			this.poPrefix = '';
		}
	};

	const isCostCenterRequired = () => {
		return (
			$cookies.get('vf.user.cost_center_is_required') === 'true' || false
		);
	};

	this.getCheckout = () => {
		vm.isLoading = true;
		Checkout.checkout()
			.then((response: any) => {
				if (!response.data.errors.length) {
					vm.extraFields = this.getExtraFields(
						response.data.custom_fields
					);
					vm.acceptedPaymentTypes = getAcceptedPaymentTypes(
						response.data.accepted_payment_types
					);
					vm.customFields = response.data.custom_fields;
					vm.hasAdditionalInfo = hasAdditionalInfo();
					vm.order = response.data.order;
					vm.shippingMethods = response.data.shipping_methods;
					vm.hasLockedBilling = response.data.lock_billing;
					vm.hasLockedShipping = response.data.lock_shipping;
				}
			})
			.finally(() => {
				vm.isLoading = false;
			});
	};

	/**
	 * @name getAcceptedPaymentTypes
	 * @param {Object} data Data returned from checkout, with 1 or 0 for flags.
	 * @return {Object} Keyed-array object with Booleans.
	 * @memberof Components.CheckoutController
	 */
	function getAcceptedPaymentTypes(data) {
		const types = {};
		Object.entries(data).forEach((element) => {
			const [key, value] = element;
			if (value === true || value === 1) {
				types[key] = true;
			}
		});
		return types;
	}

	/**
	 * @param {any} customFields Custom fields
	 * @return {Object} Additional and custom fields
	 */
	this.getExtraFields = (customFields) => {
		const extraFields: {
			attention?: ExtraField;
			organization?: ExtraField;
			cost_center_code?: ExtraField;
			issuing_office?: ExtraField;
			notes?: ExtraField;
			rr_po_num?: ExtraField;
		} = {};
		const {
			general: { checkout: additionalFields },
		} = localized.settings;
		const enabledAdditionalFields = Object.entries(additionalFields).filter(
			(element) => element[1]
		);

		// Add Additional Fields from Settings to extra fields
		const checkoutSettings = localized.settings.general.checkout;
		enabledAdditionalFields.forEach((field) => {
			const [key] = field;
			switch (key) {
				case 'attention_option':
					extraFields.attention = new ExtraField(
						'Attention',
						checkoutSettings.attention_option_required
					);
					break;
				case 'company_name_option':
					extraFields.organization = new ExtraField(
						'Company/Organization',
						checkoutSettings.company_name_option_required,
						User.company,
						'organization'
					);
					break;
				case 'cost_center_option':
					extraFields.cost_center_code = new ExtraField(
						'Cost Center Code',
						checkoutSettings.cost_center_option_required ||
							isCostCenterRequired()
					);
					break;
				case 'issuing_office_option':
					extraFields.issuing_office = new ExtraField(
						'Issuing Office',
						checkoutSettings.issuing_office_option_required
					);
					break;
				case 'notes_option':
					extraFields.notes = new ExtraField(
						'Notes',
						checkoutSettings.notes_option_required
					);
					break;
				case 'purchase_order_option':
					extraFields.rr_po_num = new ExtraField(
						'Purchase Order',
						checkoutSettings.purchase_order_option_required,
						this.poPrefix
					);
					break;
			}
		});

		// Add Custom Checkout Fields from Customer Account data to extra fields
		Object.entries(customFields).forEach((field) => {
			const [key, details]: [key: string, details: any] = field;
			extraFields[key] = new ExtraField(details.name, details.required);

			if (Array.isArray(details.value)) {
				// If multiple preset values
				if (details.value.length > 1) {
					extraFields[key].options = details.value;
					extraFields[key].value = details.value[0];
				}

				// If one preset value
				if (details.value.length === 1 && details.value[0]) {
					extraFields[key].value = details.value[0];
					extraFields[key].isReadonly = true;
				}
			} else {
				// If value isn't an array, treat like it's one preset value.
				extraFields[key].value = details.value;
				extraFields[key].isReadonly = true;
			}
		});

		// Remove any fields being replaced.
		const replacementFields = Object.entries(customFields).filter(
			(field) => field[1].replace_field
		);
		replacementFields.forEach((field) => {
			const key = field[1].replace_field;
			if (extraFields[key]) {
				delete extraFields[key];
			}
		});

		return extraFields;
	};

	/**
	 * @return {boolean} Returns true if any extra fields are enabled in Settings, or any custom fields are enabled for this customer.
	 */
	function hasAdditionalInfo() {
		const {
			general: { checkout: extraFields },
		} = localized.settings;

		return (
			Object.values(extraFields).some((element) => element === true) ||
			Object.keys(vm.customFields).length > 0
		);
	}

	function setAddresses(): void {
		if (!User.isGuest && User.name) {
			const userName = User.name.split(' ');
			const firstName = userName.shift();
			const lastName = userName.join(' ');

			vm.billingAddress = {
				first_name: firstName,
				last_name: lastName,
				email: User.email,
			};
			vm.shippingAddress = {
				first_name: firstName,
				last_name: lastName,
				email: User.email,
			};
		}
	}

	this.showTab = (tab: string) => {
		const selector = `#checkout-${tab}-tab`;
		const el = jQuery(selector);
		el.tab('show');
		window.scrollTo(0, 0);
	};
}
