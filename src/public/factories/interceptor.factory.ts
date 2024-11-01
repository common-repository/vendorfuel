import angular from 'angular';
import { getIntFromCookie } from '../common/get-int-from-cookie';

interceptorFactory.$inject = [
	'$cookies',
	'$q',
	'Alerts',
	'Auth',
	'Debug',
	'Utils',
];

export function interceptorFactory(
	$cookies: ng.cookies.ICookiesService,
	$q: ng.IQService,
	Alerts: any,
	Auth: any,
	Debug: any,
	Utils: any
) {
	const apiUrl = new URL(localized.apiURL);
	const version = 2;

	const configDataAppend = (data: any, key: string, value: any) => {
		if (typeof data === 'undefined') {
			data = {};
		}

		if (data instanceof FormData) {
			data.append(key, value);
		} else {
			data[key] = value;
		}

		return data;
	};

	const forcePasswordChange = () => {
		const url = `${Utils.getPageUrl('login')}`;
		if (!location.href.includes(url)) {
			location.assign(
				`${url}?change_pw&redirect_to=${location.pathname}${location.search}`
			);
		}
	};

	return {
		request: function request(config: any) {
			if (!config.url.includes(apiUrl.origin) || config.skipAuth) {
				return config;
			}

			config = configDataAppend(
				config,
				'requestTimestamp',
				new Date().getTime() / 1000
			);

			const groupId = getIntFromCookie($cookies.get('vf.user.group_id'));
			const currentGroupId = getIntFromCookie(
				$cookies.get('vf.user.currentGroup_id')
			);

			if (groupId && groupId !== currentGroupId) {
				config.data = configDataAppend(
					config.data,
					'use_group',
					currentGroupId
				);
				config.params = configDataAppend(
					config.params,
					'use_group',
					currentGroupId
				);
			}

			config.params = configDataAppend(
				config.params,
				'apikey',
				localized.settings.general.api_key
			);
			config.data = configDataAppend(
				config.data,
				'time',
				config.requestTimestamp
			);
			config.data = configDataAppend(
				config.data,
				'device',
				'website' + version
			);

			const token = Auth.getToken();

			if (token) {
				config.headers = configDataAppend(
					config.headers,
					'Authorization',
					'Bearer ' + token
				);
				config.data = configDataAppend(
					config.data,
					'auth-token',
					token
				);
			}

			const tokena = Auth.getAdminTokenA();
			const tokenb = Auth.getAdminTokenB();
			const adminJwt = Auth.getAdminJWT();

			if ((tokena && tokenb) || adminJwt) {
				config.data = configDataAppend(config.data, 'tokena', tokena);
				config.data = configDataAppend(config.data, 'tokenb', tokenb);
				config.data = configDataAppend(config.data, 'token', adminJwt);
			}

			if (config.data instanceof FormData) {
				config.transformRequest = angular.identity;
				delete config.headers['Content-Type'];
			}

			config.headers['x-requested-with'] = 'XMLHttpRequest';
			config.withCredentials = true;
			Debug.log('request:', config);
			return config;
		},
		response: function response(resp: any) {
			Debug.log('response:', resp);

			if (resp.data.change_pw) {
				forcePasswordChange();
			}

			if (!resp.config.url.includes(apiUrl.origin)) {
				return resp;
			}

			if (resp.data.notifications && resp.data.notifications.length) {
				angular.forEach(resp.data.notifications, function (msg) {
					Alerts.message(msg);
				});
			}

			if (resp.data.warnings && resp.data.warnings.length) {
				angular.forEach(resp.data.warnings, function (msg) {
					Alerts.warning(msg);
				});
			}

			if (resp.data.errors && resp.data.errors.length) {
				console.error(resp.data.errors);
				angular.forEach(resp.data.errors, function (err) {
					Alerts.error(err);

					switch (err) {
						case 'E0001':
							Auth.clearToken();
							window.location.assign('/login');
							break;

						case 'E0002':
							break;

						default:
							return $q.reject(resp);
					}
				});
			}

			const token = resp.headers('X-Auth-Token');

			if (token) {
				Auth.saveToken(token);
			}

			return resp;
		},
		responseError(rejection: ng.IHttpResponse<unknown>) {
			Alerts.error(`${rejection.status}: ${rejection.statusText}`);
			return $q.reject(rejection);
		},
	};
}
