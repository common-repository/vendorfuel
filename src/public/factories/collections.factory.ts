CollectionsFactory.$inject = ['$http', 'Analytics'];

export function CollectionsFactory($http: ng.IHttpService, Analytics: any) {
	const self = this;
	self.selectedCollection = {};

	try {
		self.selectedCollection = JSON.parse(
			localStorage.getItem('selectedCollection')
		);
	} catch (e) {
		self.selectedCollection = {};
	}

	self.list = (params: { q: string }) => {
		Analytics.search(params.q);
		return $http
			.post(localized.apiURL + '/catalog/search/new', params)
			.then(function (resp: { data: any }) {
				Analytics.viewSearchResults(params.q, resp.data.product_briefs);
				return resp;
			});
	};

	self.getCollections = function () {
		const req = {
			url: localized.apiURL + '/catalog/collection/',
			method: 'GET',
		};
		return $http(req).then(function (resp) {
			return resp.data;
		});
	};

	self.viewCollection = function (params: { col_id: number }) {
		const req = {
			url: localized.apiURL + '/catalog/collection/' + params.col_id,
			method: 'GET',
			params,
		};
		return $http(req).then(function (resp) {
			return resp.data;
		});
	};

	self.goToCollection = function (id: number) {
		self.viewCollection(id)
			.then(function (resp: { collection: any }) {
				localStorage.setItem(
					'selectedCollection',
					JSON.stringify(resp.collection)
				);
			})
			.finally(function () {
				const page = localized.pages.collection;

				if (angular.isUndefined(page)) {
					throw new Error('Unable to find that page.');
				} else {
					window.location.href = page.url;
				}
			});
	};

	return self;
}
