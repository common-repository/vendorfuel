import { formatURLParams } from '../common/format-url-params';

punchoutService.$inject = ['$http', 'Debug'];

export function punchoutService($http: ng.IHttpService, Debug: any) {
	const self = this;
	/**
	 * List available punchout partners.
	 *
	 * @return {unresolved}
	 */

	self.listPuchoutPartners = function () {
		const params = {};
		return $http.post(
			localized.apiURL + '/punchout/partner-catalog/list',
			params
		);
	};

	this.listSuppliers = (customerId?: number) => {
		const params: {
			customer_id?: number;
		} = {};
		if (customerId) {
			params.customer_id = customerId;
		}

		return $http.get(
			formatURLParams(localized.apiURL + '/punchout/suppliers', params)
		);
	};

	this.supplierRequest = (
		supplierId: number,
		returnUrl: string,
		orderId: number
	) => {
		const data = {
			partner_id: supplierId,
			order_id: orderId,
			return_url: returnUrl,
		};
		Debug.log(data);
		const url = `${localized.apiURL}/punchout/suppliers/${supplierId}/request`;
		return $http.post(url, data).then((response: { data: any }) => {
			if (response.data.start_page_url) {
				window.location.href = response.data.start_page_url;
			} else {
				return response;
			}
		});
	};

	self.supplierReturn = function (returned_cxml, order_id) {
		const params = {};
		params.cxml = returned_cxml;
		params.order_id = order_id;
		return $http.post(localized.apiURL + '/punchout/return', params);
	};
	/**
	 * Submit a punchout request to specified partner.
	 *
	 * @param {number} partner_id
	 * @param {string} return_url
	 * @param {number} order_id
	 * @return {unresolved}
	 */

	self.punchoutRequest = function (partner_id, return_url, order_id) {
		const params = {};
		params.partner_id = partner_id;
		params.order_id = order_id;
		params.return_url = return_url;
		Debug.log(params);
		return $http.post(
			localized.apiURL + '/punchout/partner-catalog/request',
			params
		);
	};
	/**
	 * Return from punchout sessions with cxml for a specific order.
	 *
	 * @param {Object} returned_cxml
	 * @param {number} order_id
	 * @return {unresolved}
	 */

	self.punchoutReturn = function (returned_cxml, order_id) {
		const params = {};
		params.cxml = returned_cxml;
		params.order_id = order_id;
		return $http.post(
			localized.apiURL + '/punchout/partner-catalog/return',
			params
		);
	};
}
