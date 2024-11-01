import { CheckoutService } from '../../services/checkout.service';
import template from './checkout-finalize-order.component.html';
import type { Localized } from '../../types';
declare const localized: Localized;

export const CheckoutFinalizeOrder: ng.IComponentOptions = {
	bindings: {
		acceptedPaymentTypes: '<',
		billingAddress: '<',
		extraFields: '<',
		shippingAddress: '<',
		order: '<',
		selectedShippingMethod: '<',
		isReadyToConfirm: '<',
		isShippingSameAsBilling: '<',
	},
	controller: FinalizeOrderController,
	require: {
		checkoutCtrl: '^vfCheckout',
	},
	template,
};

FinalizeOrderController.$inject = ['Alerts', 'Checkout', 'Utils'];

function FinalizeOrderController(Alerts, Checkout: CheckoutService, Utils) {
	const vm = this;
	this.warningIcon = `${localized.dir.url}public/images/warning.svg`;

	vm.$onInit = $onInit;
	vm.isPopoversInit = false;
	vm.confirmOrder = confirmOrder;
	vm.isOrderConfirmed = false;

	/**
	 * @function initPopover
	 */
	vm.initPopover = () => {
		const el = jQuery('.prop65-popover');
		if (!vm.isPopoversInit) {
			el.popover({
				trigger: 'hover focus',
				html: true,
				title: '<strong>WARNING: </strong>',
			});
			vm.isPopoversInit = true;
		}
	};

	/**
	 */
	function $onInit() {
		vm.pageUrls = {
			cart: Utils.getPageUrl('cart'),
			catalog: Utils.getPageUrl('catalog'),
		};
		vm.productSlug = localized.settings.general.product_slug || 'products';
		checkPaymentGateways(vm.acceptedPaymentTypes);
		const el = jQuery('a#checkout-review-tab');
		el.on('shown.bs.tab', function () {
			if (vm.isReadyToConfirm) {
				confirmOrder();
			}
		});
	}

	vm.$onChanges = function (changes) {
		if (changes.order && changes.order.currentValue) {
			vm.returnUrl = `https://${window.location.hostname}/cc-return/?OrderID=${vm.order.order_id}`;
		}
	};

	/**
	 * @param {Object} gateways Payment gateways
	 */
	function checkPaymentGateways(gateways) {
		if (
			!gateways.payfabric &&
			!gateways.stripe &&
			!gateways.squareup &&
			!gateways.qualpay &&
			!gateways.authnet &&
			!gateways.paypal_checkout &&
			!gateways.credit_line
		) {
			Alerts.warning('No Active Payment Gateways.');
		}
	}

	/**
	 * @function confirmOrder
	 */
	function confirmOrder() {
		enableNavWarning();
		const params = {
			selected_shipping_profile: {
				shipping_id: vm.shippingAddress.shipping_id || 0,
			},
			selected_billing_profile: {
				billing_id: vm.billingAddress?.billing_id || 0,
			},
			order: vm.order,
			selected_shipping_method: vm.selectedShippingMethod,
			shipping_first_name: vm.shippingAddress.first_name,
			shipping_last_name: vm.shippingAddress.last_name,
			shipping_email: vm.shippingAddress.email,
			shipping_address1: vm.shippingAddress.address1,
			shipping_address2: vm.shippingAddress.address2,
			shipping_city: vm.shippingAddress.city,
			shipping_state: vm.shippingAddress.state.id,
			shipping_zip: vm.shippingAddress.zip,
			shipping_phone: vm.shippingAddress.phone,
			billing_first_name: vm.isShippingSameAsBilling
				? vm.shippingAddress.first_name
				: vm.billingAddress.first_name,
			billing_last_name: vm.isShippingSameAsBilling
				? vm.shippingAddress.last_name
				: vm.billingAddress.last_name,
			billing_email: vm.isShippingSameAsBilling
				? vm.shippingAddress.email
				: vm.billingAddress.email,
			billing_address1: vm.isShippingSameAsBilling
				? vm.shippingAddress.address1
				: vm.billingAddress.address1,
			billing_address2: vm.isShippingSameAsBilling
				? vm.shippingAddress.address2
				: vm.billingAddress.address2,
			billing_city: vm.isShippingSameAsBilling
				? vm.shippingAddress.city
				: vm.billingAddress.city,
			billing_state: vm.isShippingSameAsBilling
				? vm.shippingAddress.state.id
				: vm.billingAddress.state.id,
			billing_zip: vm.isShippingSameAsBilling
				? vm.shippingAddress.zip
				: vm.billingAddress.zip,
			billing_phone: vm.isShippingSameAsBilling
				? vm.shippingAddress.phone
				: vm.billingAddress.phone,
			return_url: vm.returnUrl,
			extraFields: getExtraFields(vm.checkoutCtrl.extraFields),
		};

		vm.isOrderConfirmed = false;
		vm.confirmedOrder = {};

		Checkout.confirmOrder(params)
			.then((response) => response.data)
			.then((data: any) => {
				vm.confirmedOrder = data.order;
				vm.priceAvailability = data.priceAvailability;

				// If priceAvailability is returned, start the PA process before finishing confirmation, otherwise finish the confirmation
				if (!vm.priceAvailability) {
					finishConfirmation(data);
				}
			});
	}

	this.completePriceAvailability = (data: any) => {
		const priceAvailabilityResponse = data;
		const order = {
			order: {
				order_id: vm.order.order_id,
			},
			return_url: vm.returnUrl,
		};
		const reconfirm = true;
		Checkout.priceAvailabilityResponse(
			order,
			priceAvailabilityResponse,
			reconfirm
		).then((response: any) => {
			if (!response.data.errors.length) {
				vm.confirmedOrder = response.data.order;
				finishConfirmation(response.data);
			}
		});
	};

	/**
	 * @param {Object} data Data returned from confirmOrder
	 */
	function finishConfirmation(data) {
		vm.setHasAdditionShipping(vm.confirmedOrder.items);
		vm.confirmedItems = getConfirmedItems(vm.confirmedOrder.items);
		vm.extraFields = processExtraFields(data.order);
		vm.payfabricUrl = data.payfabric_url;
		vm.isOrderConfirmed = true;
		vm.paypalCreateOrder = data.paypal_create_order || null;
		vm.qualpay = {
			transientKey: data.qualpay_transient_key || null,
			merchantId: data.qualpay_merchant_id || null,
		};
	}

	/**
	 * @param {Object} extraFields Additional or Custom Checkout fields
	 * @return {Object} Fields with only values
	 */
	function getExtraFields(extraFields) {
		return Object.fromEntries(
			Object.entries(extraFields).map((element: any) => {
				element[1] = element[1].value;
				return element;
			})
		);
	}

	/**
	 * @param {Object} order Order data returned from confirmOrder
	 * @return {Array} Keyed array containing any extra fields with values.
	 */
	function processExtraFields(order) {
		const fields = [];
		const tempFields = {
			Organization: order.organization,
			'P.O. Number': order.rr_po_num,
			'Issuing Office': order.issuing_office,
			'Cost Center Code': order.cost_center_code,
			Attention: order.attention,
			Notes: order.notes,
		};
		Object.entries(tempFields).forEach((element) => {
			const [key, value] = element;
			if (value && value !== '') {
				fields.push({
					key,
					value,
				});
			}
		});
		for (let i = 1; i < 7; i++) {
			if (order[`f${i}_value`]) {
				fields.push({
					key: order[`f${i}_name`],
					value: order[`f${i}_value`],
				});
			}
		}
		return fields;
	}

	/**
	 * Prevents the user from navigating away from the page without a warning.
	 */
	function enableNavWarning() {
		window.onbeforeunload = function (e) {
			e.preventDefault();
			e.returnValue = '';
		};
	}

	/**
	 * @param {Object} oldItems Products.
	 * @return {Array} Confirmed items.
	 */
	function getConfirmedItems(oldItems) {
		return Object.values(oldItems).map((item: any) => {
			if (item.prop65) {
				item.prop65.warning = getProp65Warning(item.prop65.warning);
			}
			return item;
		});
	}

	/**
	 * @param {string} warning Original warning message.
	 * @return {string} Formatted warning.
	 */
	function getProp65Warning(warning) {
		warning = warning.replace(/(^warning:)/gi, '').trim(); // Strip 'Warning' since Cal law needs it bold.
		warning = warning.replace(
			/(www.p65warnings.ca.gov)/gi,
			'<a href="https://$&" target="_blank">$&</a>'
		);
		return warning;
	}

	this.setHasAdditionShipping = (
		items: { additional_shipping: boolean }[]
	) => {
		this.hasAdditionalShipping = Object.values(items).some(
			(item) => item.additional_shipping
		);
	};
}
