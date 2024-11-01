import { handleNotifications } from '../utils/handleNotifications';
import type { Localized } from '../types';
import { toast } from 'react-toastify';
declare const localized: Localized;

interceptorFactory.$inject = ['$q', '$cookies', 'Localized', 'Debug'];

export function interceptorFactory(
	$q: ng.IQService,
	$cookies: ng.cookies.ICookiesService,
	Localized: any,
	Debug: any
) {
	const service = {
		request,
		requestError,
		response,
		responseError,
	};

	return service;

	/**
	 * @param {any} config Config
	 * @return {Object} Promise
	 */
	function request(config: any) {
		let tokenA = null;
		let tokenB = null;
		let adminJwt = null;
		let logTitle = null;

		const apiURL = new URL(localized.apiURL);

		if (config.url.includes(apiURL.origin)) {
			tokenA = $cookies.get('vendorfuel-admin-tokena');
			tokenB = $cookies.get('vendorfuel-admin-tokenb');
			adminJwt = $cookies.get('vendorfuel-tenant-token');
			config.params = config.params || {};
			if (tokenA) {
				config.params.tokena = tokenA;
			}
			if (tokenB) {
				config.params.tokenb = tokenB;
			}
			if (adminJwt) {
				config.params.token = adminJwt;
			}
			if (Localized.api_key) {
				config.params.apikey = Localized.api_key;
			}
			logTitle =
				'VF API Request - ' +
				config.method +
				config.url.replace(localized.apiURL, ': ');
		} else if (config.url.includes(Localized.wpRestUrl)) {
			const wpNonce = Localized.wpNonce;
			config.headers = config.headers || {};
			config.headers['x-wp-nonce'] = wpNonce;
			config.headers.tokena = $cookies.get('vendorfuel-admin-tokena');
			config.headers.tokenb = $cookies.get('vendorfuel-admin-tokenb');
			logTitle =
				'WP REST API Request - ' +
				config.method +
				config.url.replace(Localized.wpRestUrl, ': ');
		}
		if (logTitle) {
			Debug.log(logTitle, config);
		}
		return config || $q.when(config);
	}

	/**
	 * @param {any} rejection Rejection
	 * @return {Object} Promise
	 */
	function requestError(rejection: any) {
		let logTitle = '';
		if (rejection.config.url.includes(localized.apiURL)) {
			logTitle = 'VF API Request ERROR';
		} else if (rejection.config.url.includes(Localized.wpRestUrl)) {
			logTitle = 'WP REST API Request ERROR';
		}
		if (logTitle !== '') {
			Debug.log(logTitle, rejection);
		}
		return $q.reject(rejection);
	}

	/**
	 * @param {Object} resp Response
	 * @return {Object} Promise
	 */
	function response(resp: any) {
		handleNotifications(resp.data);
		const apiURL = localized.apiURL.replace('v1.0.0', '');

		let logTitle = '';
		if (resp.config.url.includes(apiURL)) {
			if (resp.data.errors && resp.data.errors.length > 0) {
				logTitle =
					'VF API Response ERROR - ' +
					resp.config.method +
					resp.config.url.replace(localized.apiURL, ': ') +
					' [' +
					resp.data.errors[0] +
					']';
			} else {
				logTitle =
					'VF API Response - ' +
					resp.config.method +
					resp.config.url.replace(localized.apiURL, ': ');
			}
		} else if (resp.config.url.includes(Localized.wpRestUrl)) {
			logTitle =
				'WP REST API Response - ' +
				resp.config.method +
				resp.config.url.replace(Localized.wpRestUrl, ': ');
		}
		if (logTitle !== '') {
			if (resp.title) {
				logTitle += ' - ' + resp.method + ': ' + resp.title;
			}
			Debug.log(logTitle, resp);
		}
		return resp || $q.when(resp);
	}

	/**
	 * @param {any} rejection Rejection
	 * @return {Object} Promise
	 */
	function responseError(rejection: any) {
		toast.error(rejection.statusText, {
			autoClose: 10000,
		});

		let logTitle = '';
		if (rejection.config.url.includes(localized.apiURL)) {
			logTitle =
				'VF API Response ERROR - ' +
				rejection.config.method +
				rejection.config.url.replace(localized.apiURL, ': ');
		} else if (rejection.config.url.includes(Localized.wpRestUrl)) {
			logTitle =
				'WP REST API Response ERROR - ' +
				rejection.config.method +
				rejection.config.url.replace(Localized.wpRestUrl, ': ');
		}
		if (logTitle !== '') {
			if (rejection.title) {
				logTitle += ' - ' + rejection.method + ': ' + rejection.title;
			}
			Debug.log(logTitle, rejection);
		}
		return $q.reject(rejection);
	}
}
