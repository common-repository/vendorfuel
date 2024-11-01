priceSheetsFactory.$inject = ['Localized', 'Utils', 'Admin'];

export function priceSheetsFactory(Localized: any, Utils: any, Admin: any) {
	const service = {
		deletePriceSheet,
		errors: {},
		list: {
			name: 'list',
			saved: {},
			Get() {
				return getPriceSheets(service.list, '/admin/price-sheet/list');
			},
			Set() {
				const params = {
					settings: JSON.stringify(service.list),
				};
				return postPriceSheets(service.list, params).then(() => {
					if (service.list.api_url !== localized.apiURL) {
						localized.apiURL = service.list.api_url;
						Admin.Logout();
					}
					if (service.list.api_key !== Localized.api_key) {
						Localized.api_key = service.list.api_key;
						Admin.Logout();
					}
				});
			},
		} as any,
	};

	/**
	 * Delete a price sheet.
	 *
	 * @param {number} id Price sheet ID
	 * @return {Promise} Promise
	 */
	function deletePriceSheet(id: number) {
		const endpoint = `${localized.apiURL}/admin/pricesheets/${id}`;
		return Utils.httpDelete(endpoint);
	}

	/**
	 * @param {any}    tab Tab
	 * @param {string} url URL
	 * @return {Object} Promise
	 */
	function getPriceSheets(tab: any, url: string) {
		let httpUrl = localized.apiURL + url;
		if (!url) {
			httpUrl =
				Localized.wpRestUrl + '/admin/price-sheet/' + tab.name + '/get';
		}
		const promise = Utils.httpGet(httpUrl).then(
			(response: any) => {
				tab.saved = response;
			},
			(response: any) => {
				tab.saved = response;
			}
		);
		return promise;
	}
	/**
	 * @param {any}    tab    Tab
	 * @param {Object} params Parameters
	 * @param {string} url    URL
	 * @return {Object} Promise
	 */
	function postPriceSheets(tab: any, params: any, url?: string) {
		let httpUrl = localized.apiURL + url;
		if (!url) {
			httpUrl =
				Localized.wpRestUrl +
				'/admin/price-sheet/' +
				tab.name +
				'/post';
		}
		const promise = Utils.httpPost(httpUrl, params).then(
			(response: any) => {
				if (response.errors) {
					service.errors = response.errors;
				}
			},
			(response: any) => {
				if (response.errors) {
					service.errors = response.errors;
				}
			}
		);
		return promise;
	}

	return service;
}
