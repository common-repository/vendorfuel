tenantFactory.$inject = ['$http', '$cookies', 'Debug'];

export function tenantFactory(
	$http: ng.IHttpService,
	$cookies: ng.cookies.ICookiesService,
	Debug: any
) {
	const service = {
		login_errors: {} as any,
		Login(e: string, p: string) {
			//TODO: get api url from settings factory
			const req = {
				method: 'POST',
				url: localized.apiURL + '/tenant/login',
				data: {
					email: e,
					password: p,
				},
			};
			const promise = $http(req).then(
				(response: any) => {
					if (Object.keys(response.data.errors).length > 0) {
						Debug.error('Login errors: ', response.data.errors);
						service.login_errors = response.data.errors;
					} else {
						tenant.name = response.data.name;
						$cookies.put('vendorfuel-tenant-name', tenant.name);
						tenant.tokens.jwt = response.data.token;
						$cookies.put(
							'vendorfuel-tenant-token',
							tenant.tokens.jwt
						);
						tenant.authed = true;
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
		Logout() {
			tenant.name = null;
			$cookies.remove('vendorfuel-tenant-name');
			tenant.tokens.jwt = null;
			$cookies.remove('vendorfuel-tenant-token');
			tenant.authed = false;
		},
		Authed() {
			const token = $cookies.get('vendorfuel-tenant-token');
			if (token) {
				tenant.authed = true;
			} else {
				tenant.authed = false;
			}
			return tenant.authed;
		},
	};

	const tenant = {
		authed: false,
		name: '',
		tokens: {
			a: '',
			b: '',
			jwt: '',
		},
	};

	return service;
}
