settingsFactory.$inject = ['Localized', 'Utils', 'Admin'];

export function settingsFactory(Localized: any, Utils: any, Admin: any) {
	/**
	 * @param {any}    tab Tab
	 * @param {string} url URL
	 * @return {Object} Promise
	 */
	function getSettings(tab: any, url?: string) {
		let httpUrl = localized.apiURL + url;
		if (!url) {
			httpUrl = Localized.wpRestUrl + '/settings/' + tab.name;
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
	 * @param {Object} params Params
	 * @param {string} url    URL
	 * @param {Object} data   Data
	 * @return {Object} Promise
	 */
	function postSettings(tab: any, params: any, url?: string, data?: any) {
		let httpUrl = localized.apiURL + url;
		if (!url) {
			httpUrl = Localized.wpRestUrl + '/settings/' + tab.name;
		}
		const promise = Utils.httpPost(httpUrl, params, data).then(
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
	/**
	 * @param {any}    tab    Tab
	 * @param {Object} params Params
	 * @param {string} url    URL
	 * @param {Object} data   Data
	 * @return {Object} Promise
	 */
	function putSettings(tab: any, params: any, url: string, data?: any) {
		let httpUrl = localized.apiURL + url;
		if (!url) {
			httpUrl = Localized.wpRestUrl + '/settings/' + tab.name + '/post';
		}
		const promise = Utils.httpPut(httpUrl, params, data).then(
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

	const service = {
		errors: {},
		general: {
			name: 'general',
			saved: {} as any,
			Get() {
				return getSettings(service.general);
			},
			Set() {
				const params = {
					settings: JSON.stringify(service.general.saved),
				};
				return postSettings(service.general, params).then(() => {
					if (service.general.saved.api_url !== localized.apiURL) {
						localized.apiURL = service.general.saved.api_url;
						Admin.Logout();
					}
					if (service.general.saved.api_key !== Localized.api_key) {
						Localized.api_key = service.general.saved.api_key;
						Admin.Logout();
					}
				});
			},
		},
		store: {
			name: 'store',
			saved: {} as any,
			Get() {
				return getSettings(service.store, '/stores').then(() => {
					service.store.saved = service.store.saved.store;
				});
			},
			Set() {
				const params = {
					name: service.store.saved.name,
					url: service.store.saved.url,
					default_order_prefix:
						service.store.saved.default_order_prefix,
					default_customer_prefix:
						service.store.saved.default_customer_prefix,
					options: service.store.saved.options,
					checkout: service.store.saved.checkout,
				};
				postSettings(service.store, params);
				return putSettings(service.store, null, '/stores', params);
			},
			Changed() {},
		},
		analytics: {
			name: 'analytics',
			saved: {} as any,
			Get() {
				return getSettings(service.analytics);
			},
			Set() {
				const params = {
					settings: JSON.stringify(service.analytics.saved),
				};
				return postSettings(service.analytics, params);
			},
			Changed(enabled: any) {
				if (!enabled) {
					service.analytics.saved.google.id = '';
					service.analytics.saved.google.label = '';
					service.analytics.saved.google.tracking = false;
				}
			},
		},
		anguledit: {
			name: 'anguledit',
			saved: {},
			Get() {
				return getSettings(service.anguledit);
			},
			Set() {
				const params = {
					settings: JSON.stringify(service.anguledit.saved),
				};
				return postSettings(service.anguledit, params).then(() => {});
			},
		},
		gateways: {
			name: 'gateways',
			saved: {} as any,
			Get() {
				return getSettings(service.gateways, '/admin/gateways').then(
					() => {
						service.gateways.saved.gateways.authnet.enabled =
							service.gateways.saved.gateways.authnet.enabled ===
							'true';
						service.gateways.saved.gateways.paypal.enabled =
							service.gateways.saved.gateways.paypal.enabled ===
							'true';
						service.gateways.Changed(
							0,
							service.gateways.saved.gateways.authnet.enabled
						);
						service.gateways.Changed(
							1,
							service.gateways.saved.gateways.paypal.enabled
						);
					}
				);
			},
			Set() {
				const params = {
					'gateways[authnet][enabled]':
						service.gateways.saved.gateways.authnet.enabled,
					'gateways[authnet][id]':
						service.gateways.saved.gateways.authnet.id,
					'gateways[authnet][key]':
						service.gateways.saved.gateways.authnet.key,
					'gateways[paypal][enabled]':
						service.gateways.saved.gateways.paypal.enabled,
					'gateways[paypal][client_id]':
						service.gateways.saved.gateways.paypal.client_id,
					'gateways[paypal][secret]':
						service.gateways.saved.gateways.paypal.secret,
				};
				return putSettings(service.gateways, params, '/admin/gateways');
			},
			Changed(i: number, enabled: boolean) {
				if (!enabled && i === 0) {
					service.gateways.saved.gateways.authnet.id = '';
					service.gateways.saved.gateways.authnet.key = '';
				} else if (!enabled && i === 1) {
					service.gateways.saved.gateways.paypal.client_id = '';
					service.gateways.saved.gateways.paypal.secret = '';
				}
			},
		},
	};
	return service;
}
