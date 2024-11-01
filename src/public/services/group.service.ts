interface Params {
	filters?: {
		field: string;
		term: string;
	}[];
	page?: number;
	q?: string;
	searchBy?: string;
	orderBy?: string;
	direction?: 'asc' | 'desc';
	status?: string;
}

groupService.$inject = ['$http', 'Analytics'];

export function groupService($http: ng.IHttpService, Analytics: any) {
	const self = this;
	/**
	 * Adds/Updates an item in a group pending order
	 *
	 * @param {number} order_id        - the pending order id
	 * @param {string} sku             - sku of the item to add/update
	 * @param {number} qty             - the quantity of item to add
	 * @param {number} shipping_method - the id of the shipping method to use on order recalculation
	 * @return {unresolved}
	 */

	self.addItem = function (order_id, sku, qty, shipping_method) {
		const params = {
			order_id,
			sku,
			qty,
			shipping_method,
		};
		return $http.post(
			localized.apiURL + '/group/pending-order/add-item',
			params
		);
	};
	/**
	 * Get list of accounts in group.
	 *
	 * @return {unresolved}
	 */

	self.listGroup = function () {
		const params = {};
		return $http.post(localized.apiURL + '/group/account/list', params);
	};
	/**
	 * Change group permissions for an account.
	 *
	 * @param {number}  customer_id
	 * @param {boolean} active
	 * @param {number}  approver
	 * @param {boolean} admin
	 * @return {unresolved}
	 */

	self.changeGroupPermissions = function (
		customer_id,
		active,
		approver,
		admin,
		requestor,
		pending_emails
	) {
		const params = {
			customer_id,
			active,
			approver,
			admin,
			requestor,
			pending_emails,
		};
		return $http.post(localized.apiURL + '/group/account/modify', params);
	};

	/**
	 * List completed group orders.
	 *
	 * @param {Object} params
	 * @return {Promise} response
	 */
	this.listGroupOrders = (params: Params) => {
		const url = `${localized.apiURL}/group/orders`;
		return $http.get(url, {
			params,
			paramSerializer: '$httpParamSerializerJQLike',
		});
	};

	/**
	 * View a completed group order.
	 *
	 * @param {number} order_id
	 * @return {unresolved}
	 */

	self.viewGroupOrder = function (order_id) {
		const params = {};

		if (typeof order_id !== 'undefined') {
			params.order_id = order_id;
		}

		return $http.post(localized.apiURL + '/group/order/view', params);
	};
	/**
	 * List pending group orders.
	 *
	 * @param {Object} params
	 * @return {Promise} response
	 */
	this.listGroupPendingOrders = (params: Params) => {
		const url = `${localized.apiURL}/group/pending-orders`;
		return $http.get(url, {
			params,
			paramSerializer: '$httpParamSerializerJQLike',
		});
	};
	/**
	 * View pending group order.
	 *
	 * @param {boolean} orderBy
	 * @return {unresolved}
	 */

	self.viewGroupPendingOrder = function (order_id) {
		const params = {};

		if (typeof order_id !== 'undefined') {
			params.order_id = order_id;
		}

		return $http.post(
			localized.apiURL + '/group/pending-order/view',
			params
		);
	};
	/**
	 * Cancel pending group order.
	 *
	 * @param {number} order_id
	 * @return {unresolved}
	 */

	self.cancelGroupPendingOrder = function (order_id) {
		const params = {};

		if (typeof order_id !== 'undefined') {
			params.order_id = order_id;
		}

		return $http.post(
			localized.apiURL + '/group/pending-order/cancel',
			params
		);
	};
	/**
	 * Confirm pending group order.
	 *
	 * @param {Object} checkout_info
	 * @return {Object}
	 */

	self.confirmGroupOrder = function (checkout_info) {
		const params = {};
		params.shipping_id =
			checkout_info.selected_shipping_profile.shipping_id;
		params.billing_id = checkout_info.selected_billing_profile.billing_id;
		params.order_id = checkout_info.order_id;
		params.shipping_method = checkout_info.selected_shipping_method;
		params.shipping_first_name = checkout_info.shipping_first_name;
		params.shipping_last_name = checkout_info.shipping_last_name;
		params.shipping_email = checkout_info.shipping_email;
		params.shipping_address1 = checkout_info.shipping_address1;
		params.shipping_address2 = checkout_info.shipping_address2;
		params.shipping_city = checkout_info.shipping_city;
		params.shipping_state = checkout_info.shipping_state;
		params.shipping_zip = checkout_info.shipping_zip;
		params.shipping_phone = checkout_info.shipping_phone;
		params.billing_first_name = checkout_info.billing_first_name;
		params.billing_last_name = checkout_info.billing_last_name;
		params.billing_email = checkout_info.billing_email;
		params.billing_address1 = checkout_info.billing_address1;
		params.billing_address2 = checkout_info.billing_address2;
		params.billing_city = checkout_info.billing_city;
		params.billing_state = checkout_info.billing_state;
		params.billing_zip = checkout_info.billing_zip;
		params.billing_phone = checkout_info.billing_phone;
		//TODO: add customFields to settings service
		if (localized.settings.general.checkout.company_name_option) {
			params.organization = checkout_info.order.organization;
		}

		if (localized.settings.general.checkout.purchase_order_option) {
			params.rr_po_num = checkout_info.order.rr_po_num;
		}

		if (localized.settings.general.checkout.issuing_office_option) {
			params.issuing_office = checkout_info.order.issuing_office;
		}

		if (localized.settings.general.checkout.cost_center_option) {
			params.cost_center_code = checkout_info.order.cost_center_code;
		}

		if (localized.settings.general.checkout.attention_option) {
			params.attention = checkout_info.order.attention;
		}

		if (localized.settings.general.checkout.notes_option) {
			params.notes = checkout_info.order.notes;
		}

		if (localized.settings.general.checkout.notes_option) {
			params.approver_notes = checkout_info.order.approver_notes;
		}

		if (checkout_info.order.customFields) {
			if (checkout_info.order.customFields.f1 !== '') {
				params.f1 = checkout_info.order.customFields.f1;
			}

			if (checkout_info.order.customFields.f2 !== '') {
				params.f2 = checkout_info.order.customFields.f2;
			}

			if (checkout_info.order.customFields.f3 !== '') {
				params.f3 = checkout_info.order.customFields.f3;
			}

			if (checkout_info.order.customFields.f4 !== '') {
				params.f4 = checkout_info.order.customFields.f4;
			}

			if (checkout_info.order.customFields.f5 !== '') {
				params.f5 = checkout_info.order.customFields.f5;
			}

			if (checkout_info.order.customFields.f6 !== '') {
				params.f6 = checkout_info.order.customFields.f6;
			}
		}

		return $http
			.post(localized.apiURL + '/group/pending-order/confirm', params)
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Complete pending group order.
	 *
	 * @param {Object} params
	 * @return {Object}
	 */

	self.completeGroupOrder = function (params) {
		return $http
			.post(localized.apiURL + '/group/pending-order/complete', params)
			.then(function (resp) {
				Analytics.purchase(resp.data);
				return resp;
			});
	};
	/**
	 * Remove item from a pending group order.
	 *
	 * @param {number} orderId
	 * @param {number} productId
	 * @return {Object}
	 */

	this.groupPendingOrderRemoveItem = (orderId: number, productId: number) => {
		if (orderId) {
			const url = `${localized.apiURL}/group/pending-order/remove-item`;
			const data = {
				order_id: orderId,
				product_id: productId,
			};

			return $http.post(url, data);
		}
	};
	/**
	 * Add RMA to a group order.
	 *
	 * @param {number} purch_id
	 * @param {string} notes
	 * @param {string} reason
	 * @param {number} qty
	 * @return {unresolved}
	 */

	self.addGroupRma = function (purch_id, notes, reason, qty) {
		const params = {};
		params.purch_id = purch_id;
		params.notes = notes;
		params.reason = reason;
		params.qty = qty;
		return $http.post(localized.apiURL + '/group/rma/request', params);
	};
}
