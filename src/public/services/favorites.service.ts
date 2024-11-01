favoritesService.$inject = ['$http', '$q', 'Alerts', 'User'];

export function favoritesService(
	$http: ng.IHttpService,
	$q: ng.IQService,
	Alerts: any,
	User: any
) {
	const self = this;
	/**
	 * List of items.
	 */

	self.items = {};
	/**
	 * Add product to favorites.
	 *
	 * @param {number} productId
	 */

	self.add = function (productId: number) {
		if (!User.isAuthed) {
			Alerts.error('You must login to add an item to favorites.');
			return $q.reject(false);
		}

		return $http.post(localized.apiURL + '/cart/favorites/add', {
			product_id: productId,
		});
	};
	/**
	 * Retrieve item details.
	 *
	 */

	self.fillDetails = function () {
		return $http
			.get(localized.apiURL + '/cart/favorites/view')
			.then(function (resp: any) {
				if (resp.data.favorites && resp.data.favorites.length) {
					self.items = resp.data.favorites;
				}

				return resp;
			});
	};
	/**
	 * Remove product from favorites.
	 *
	 * @param {number} productId
	 */

	self.remove = function (productId: number) {
		if (!User.isAuthed) {
			return false;
		}

		return $http.post(localized.apiURL + '/cart/favorites/remove', {
			product_id: productId,
		});
	};
}
