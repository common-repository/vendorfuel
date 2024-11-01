interface ICheckoutParams {
	paypal?: unknown;
	return_url?: string;
	cancel_url?: string;
	items?: unknown;
	shipping_id?: number;
}

interface ICheckoutInfo {
	selected_shipping_profile: {
		shipping_id: number;
	};
	selected_billing_profile: {
		billing_id: number;
	};
	order: any;
	selected_shipping_method: any;
	shipping_first_name: string;
	shipping_last_name: string;
	shipping_email: string;
	shipping_address1: string;
	shipping_address2: string;
	shipping_city: string;
	shipping_state: string;
	shipping_zip: string;
	shipping_phone: string;
	billing_first_name: string;
	billing_last_name: string;
	billing_email: string;
	billing_address1: string;
	billing_address2: string;
	billing_city: string;
	billing_state: string;
	billing_zip: string;
	billing_phone: string;
	return_url: string;
	extraFields: {
		organization?: string;
		rr_po_num?: string;
		issuing_office?: string;
		cost_center_code?: string;
		attention?: string;
		notes?: string;
		f1?: string;
		f2?: string;
		f3?: string;
		f4?: string;
		f5?: string;
		f6?: string;
	};
}

interface IConfirmOrderParams {
	order_id?: number;
	billing_id?: number;
	billing_first_name: string;
	billing_last_name: string;
	billing_email: string;
	billing_address1: string;
	billing_address2: string;
	billing_city: string;
	billing_state: string;
	billing_zip: string;
	billing_phone: string;
	shipping_id?: number;
	shipping_method?: unknown;
	shipping_first_name: string;
	shipping_last_name: string;
	shipping_email: string;
	shipping_address1: string;
	shipping_address2: string;
	shipping_city: string;
	shipping_state: string;
	shipping_zip: string;
	shipping_phone: string;
	return_url: string;
	organization?: string;
	rr_po_num?: string;
	issuing_office?: string;
	cost_center_code?: string;
	attention?: string;
	notes?: string;
	f1?: string;
	f2?: string;
	f3?: string;
	f4?: string;
	f5?: string;
	f6?: string;
}

export class CheckoutService {
	static $inject = ['$cookies', '$http', 'Analytics'];

	// eslint-disable-next-line no-useless-constructor
	constructor(
		private $cookies: ng.cookies.ICookiesService,
		private $http: ng.IHttpService,
		private Analytics: any
	) {}

	checkout(
		paypal?: unknown,
		returnUrl?: string,
		cancelUrl?: string,
		shippingId?: number
	) {
		const url = localized.apiURL + '/cart/checkout';
		const params: ICheckoutParams = {};
		if (typeof paypal !== 'undefined') {
			params.paypal = paypal;
			params.return_url = returnUrl;
			params.cancel_url = cancelUrl;
		}

		if (this.$cookies.get('vf.cart.partial') !== null) {
			try {
				params.items = JSON.parse(this.$cookies.get('vf.cart.partial'));
			} catch (e) {
				params.items = {};
			}
		}

		if (shippingId) {
			params.shipping_id = shippingId;
		}

		return this.$http.post(url, params).then((response) => {
			this.$cookies.put('vf.cart.partial', null, {
				samesite: 'none',
				secure: true,
				path: '/',
			});
			this.Analytics.beginCheckout(response.data);
			return response;
		});
	}

	completeOrder(params: unknown) {
		const url = localized.apiURL + '/cart/order/complete';
		return this.$http.post(url, params).then((response) => {
			this.Analytics.purchase(response.data);
			return response;
		});
	}

	confirmOrder(checkoutInfo: ICheckoutInfo) {
		const url = localized.apiURL + '/cart/order/confirm';
		const params: IConfirmOrderParams = {
			shipping_id: checkoutInfo.selected_shipping_profile.shipping_id,
			billing_id: checkoutInfo.selected_billing_profile.billing_id,
			order_id: checkoutInfo.order.order_id,
			shipping_method: checkoutInfo.selected_shipping_method,
			shipping_first_name: checkoutInfo.shipping_first_name,
			shipping_last_name: checkoutInfo.shipping_last_name,
			shipping_email: checkoutInfo.shipping_email,
			shipping_address1: checkoutInfo.shipping_address1,
			shipping_address2: checkoutInfo.shipping_address2,
			shipping_city: checkoutInfo.shipping_city,
			shipping_state: checkoutInfo.shipping_state,
			shipping_zip: checkoutInfo.shipping_zip,
			shipping_phone: checkoutInfo.shipping_phone,
			billing_first_name: checkoutInfo.billing_first_name,
			billing_last_name: checkoutInfo.billing_last_name,
			billing_email: checkoutInfo.billing_email,
			billing_address1: checkoutInfo.billing_address1,
			billing_address2: checkoutInfo.billing_address2,
			billing_city: checkoutInfo.billing_city,
			billing_state: checkoutInfo.billing_state,
			billing_zip: checkoutInfo.billing_zip,
			billing_phone: checkoutInfo.billing_phone,
			return_url: checkoutInfo.return_url,
		};

		if (localized.settings.general.checkout.company_name_option) {
			params.organization = checkoutInfo.extraFields.organization;
		}

		if (localized.settings.general.checkout.purchase_order_option) {
			params.rr_po_num = checkoutInfo.extraFields.rr_po_num;
		}

		if (localized.settings.general.checkout.issuing_office_option) {
			params.issuing_office = checkoutInfo.extraFields.issuing_office;
		}

		if (localized.settings.general.checkout.cost_center_option) {
			params.cost_center_code = checkoutInfo.extraFields.cost_center_code;
		}

		if (localized.settings.general.checkout.attention_option) {
			params.attention = checkoutInfo.extraFields.attention;
		}

		if (localized.settings.general.checkout.notes_option) {
			params.notes = checkoutInfo.extraFields.notes;
		}

		if (checkoutInfo.extraFields.f1 !== '') {
			params.f1 = checkoutInfo.extraFields.f1;
		}

		if (checkoutInfo.extraFields.f2 !== '') {
			params.f2 = checkoutInfo.extraFields.f2;
		}

		if (checkoutInfo.extraFields.f3 !== '') {
			params.f3 = checkoutInfo.extraFields.f3;
		}

		if (checkoutInfo.extraFields.f4 !== '') {
			params.f4 = checkoutInfo.extraFields.f4;
		}

		if (checkoutInfo.extraFields.f5 !== '') {
			params.f5 = checkoutInfo.extraFields.f5;
		}

		if (checkoutInfo.extraFields.f6 !== '') {
			params.f6 = checkoutInfo.extraFields.f6;
		}

		return this.$http.post(url, params).then((response) => {
			return response;
		});
	}

	getShippingMethods(orderId: number, profileId: number, zipcode: string) {
		const url = localized.apiURL + '/cart/order/shipping/methods';
		const params = {
			order_id: orderId,
			shipping_id: profileId,
			zipcode,
		};
		return this.$http.post(url, params).then((response) => {
			return response;
		});
	}

	priceAvailabilityResponse(
		order: { order: { order_id: number }; return_url: string },
		priceAvailabilityResponse: unknown,
		reconfirm: unknown
	) {
		const url = localized.apiURL + '/cart/order/price-availability';
		const params = {
			order_id: order.order.order_id,
			return_url: order.return_url,
			price_availability_response: priceAvailabilityResponse,
			reconfirm,
		};
		return this.$http.post(url, params).then((response) => {
			return response;
		});
	}
}
