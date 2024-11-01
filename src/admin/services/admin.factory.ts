import type { Localized } from '../types';
declare const localized: Localized;

adminFactory.$inject = [
	'$http',
	'$cookies',
	'Localized',
	'Debug',
	'TwoFactorModal',
];

export function adminFactory(
	$http: ng.IHttpService,
	$cookies: ng.cookies.ICookiesService,
	Localized: any,
	Debug: any,
	TwoFactorModal: any
) {
	const admin = {
		authed: false,
		name: '',
		tokens: {
			a: '',
			b: '',
			jwt: '',
		},
	};

	const service = {
		login_errors: {},
		Login(e: string, p: string, a: any, rememberMe: boolean) {
			//TODO: get api url from settings factory
			const request = {
				method: 'POST',
				url: localized.apiURL + '/admin/login',
				data: {
					email: e,
					password: p,
					authenticator: a,
				},
			};
			const promise = $http(request).then(
				(response: any) => {
					if (Object.keys(response.data.errors).length > 0) {
						Debug.error('Login errors: ', response.data.errors);
						service.login_errors = response.data.errors;
					} else if (response.data.token_2fa) {
						const callback = {
							confirm(confirmResponse: any) {
								const req = {
									method: 'POST',
									url:
										localized.apiURL +
										'/admin/authenticate',
									data: {
										token_2fa: response.data.token_2fa,
										auth_code: confirmResponse.code_2fa,
									},
								};
								$http(req).then(
									(resp: any) => {
										service.SetTokens(
											resp.data.name,
											resp.data.tokena,
											resp.data.tokenb,
											rememberMe
										);
									},
									(errResp) => {
										Debug.error(errResp);
									}
								);
							},
							cancel() {
								const req = {
									method: 'POST',
									url:
										localized.apiURL +
										'/admin/clear-secret',
									data: {
										token_2fa: response.data.token_2fa,
									},
								};
								$http(req).then(
									() => {},
									(errResp) => {
										Debug.error(errResp);
									}
								);
							},
							params: {
								imgSrc: response.data.qrCodeUrl,
								code_2fa: '',
							},
						};
						let modalMessage =
							'<p>Scan the QR code then enter your VendorFuel authentication code from your mobile app</p>';
						modalMessage +=
							"<label for='mdlMsg'>Authenticator: </label>";
						modalMessage +=
							"<input id='mdlMsg' type='text' ng-model='callbackParams.code_2fa' ng-change='ApplyChangeToCallback()'>";
						TwoFactorModal.Show(
							callback,
							'Google 2-Factor Authentication',
							modalMessage,
							'Back',
							'Complete'
						);
					} else {
						service.SetTokens(
							response.data.name,
							response.data.tokena,
							response.data.tokenb,
							rememberMe
						);
					}
					return response;
				},
				(response) => {
					if (response.xhrStatus === 'error') {
						service.login_errors.error =
							'Invalid VendorFuel API URL.';
					}

					if (Object.keys(response.data.errors).length > 0) {
						Debug.error('Login errors: ', response.data.errors);
						service.login_errors = response.data.errors;
					}

					return response;
				}
			);
			return promise;
		},
		LoginErrors() {
			return service.login_errors;
		},
		Download(req: any) {
			return (
				req +
				'?apikey=' +
				Localized.api_key +
				'&tokena=' +
				$cookies.get('vendorfuel-admin-tokena') +
				'&tokenb=' +
				$cookies.get('vendorfuel-admin-tokenb')
			);
		},
		Logout() {
			const config = {
				path: '/',
				samesite: 'strict',
				secure: true,
				session: 'none',
			};
			admin.name = '';
			$cookies.remove('vendorfuel-admin-name', config);
			admin.tokens.a = '';
			$cookies.remove('vendorfuel-admin-tokena', config);
			admin.tokens.b = '';
			$cookies.remove('vendorfuel-admin-tokenb', config);
			admin.tokens.jwt = '';
			$cookies.remove('vendorfuel-tenant-token', config);
			admin.authed = false;
		},
		Authed() {
			const tokenA = $cookies.get('vendorfuel-admin-tokena');
			const tokenB = $cookies.get('vendorfuel-admin-tokenb');
			if (tokenA && tokenB) {
				admin.authed = true;
			} else {
				admin.authed = false;
			}
			return admin.authed;
		},
		SetTokens(
			name: string,
			tokena: string,
			tokenb: string,
			rememberMe: boolean,
			jwt?: any
		) {
			const config = {
				path: '/',
				samesite: 'strict',
				secure: true,
				session: 'none',
			} as any;
			if (rememberMe) {
				const d = new Date();
				d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
				config.expires = d.toUTCString();
			}

			admin.name = name;
			$cookies.put('vendorfuel-admin-name', admin.name);
			admin.tokens.a = tokena;
			$cookies.put('vendorfuel-admin-tokena', admin.tokens.a, config);
			admin.tokens.b = tokenb;
			$cookies.put('vendorfuel-admin-tokenb', admin.tokens.b, config);
			if (jwt) {
				admin.tokens.jwt = jwt;
				$cookies.put(
					'vendorfuel-tenant-token',
					admin.tokens.jwt,
					config
				);
			}
			admin.authed = true;
			return admin.authed;
		},
	} as any;

	return service;
}
