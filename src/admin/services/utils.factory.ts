utilsFactory.$inject = ['$http', '$location', 'Admin'];

export function utilsFactory(
	$http: ng.IHttpService,
	$location: ng.ILocationService,
	Admin: any
) {
	/**
	 * @param {Object} request HTTP request
	 * @param          version
	 * @return {Object} Promise
	 */
	function httpPromise(request: any, version?: number) {
		if (version) {
			request.url = request.url.replace('v1', `v${version}`);
		}

		const promise = $http(request).then(
			(response: any) => {
				if (response.data) {
					return response.data;
				}
				console.error(response.statusText);
				return response;
			},
			(response) => {
				if (response.status === 401) {
					Admin.Logout();
				}
				console.error(response.statusText);
				return response;
			}
		);
		return promise;
	}

	const service: any = {
		httpGet,
		httpPost,
		httpPut,
		httpDelete,
		getHttpPromise,
		setLocation,
		cleanKey,
		cleanErrorMessages,
		trimExtraSp,
	};

	return service;

	/**
	 * Get all items.
	 *
	 * @param {string} endpoint REST API endpoint
	 * @param {Object} params   Parameters
	 * @param {Object} data     Data
	 * @return {Object} Promise
	 */
	function httpGet(endpoint: string, params: any, data: any) {
		params = params || {};
		data = data || {};
		const req = { method: 'GET', url: endpoint, params, data };
		return httpPromise(req);
	}

	/**
	 * Create an item.
	 *
	 * @param {string} endpoint REST API endpoint
	 * @param {Object} params   Parameters
	 * @param {Object} data     Data
	 * @return {Object} Promise
	 */
	function httpPost(endpoint: string, params: any, data: any) {
		params = params || {};
		data = data || {};
		const req = { method: 'POST', url: endpoint, params, data };
		return httpPromise(req);
	}

	/**
	 * Update an existing item.
	 *
	 * @param {string} endpoint REST API endpoint
	 * @param {Object} params   Parameters
	 * @param {Object} data     Data
	 * @param          version
	 * @return {Object} Promise
	 */
	function httpPut(
		endpoint: string,
		params: any,
		data: any,
		version?: number
	) {
		params = params || {};
		data = data || {};
		const req = { method: 'PUT', url: endpoint, params, data };
		return httpPromise(req, version);
	}

	/**
	 * Delete an item.
	 *
	 * @param {string} endpoint REST API endpoint
	 * @param {Object} params   Parameters
	 * @param {Object} data     Data
	 * @return {Object} Promise
	 */
	function httpDelete(endpoint: string, params: any, data: any) {
		params = params || {};
		data = data || {};
		const req = { method: 'DELETE', url: endpoint, params, data };
		return httpPromise(req);
	}

	/**
	 * @param {Object} req     Request
	 * @param          version
	 * @return {Object} Promise
	 */
	function getHttpPromise(req: any, version?: number) {
		return httpPromise(req, version);
	}

	/**
	 * @param {string}  location     Path
	 * @param {boolean} shouldReturn Should return
	 */
	function setLocation(location: string, shouldReturn: boolean) {
		if (!service.redirecting) {
			service.redirecting = true;
			if (shouldReturn === true) {
				service.ReturnLocation = $location.url();
			}
			$location.path(location);
		}
	}

	/**
	 * @param {string} str Key
	 * @return {string} Cleaned key
	 */
	function cleanKey(str: string) {
		return str.toLowerCase().replace(/\s+/g, '-');
	}

	/**
	 * @param {string} str Message
	 * @return {string} Trimmed message
	 */
	function cleanErrorMessages(str: string) {
		return str.toString().trim();
	}

	/**
	 * @param {string} str String
	 * @return {string} Trimmed string
	 */
	function trimExtraSp(str: string) {
		return str.replace(/\s+/g, '');
	}
}
