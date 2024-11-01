productsFactory.$inject = ['$http', '$resource', 'Analytics'];

export function productsFactory(
	$http: ng.IHttpService,
	$resource: any,
	Analytics: any
) {
	const self = this;
	self.recentlyViewed = JSON.parse(
		localStorage.getItem('recentlyViewed') || '[]'
	);

	const resource = $resource(
		localized.apiURL + '/catalog/product/:verb',
		{},
		{
			view: {
				method: 'POST',
				params: {
					verb: 'view',
				},
			},
			reviews: {
				method: 'POST',
				params: {
					verb: 'reviews',
				},
			},
		}
	);
	self.get = resource.view;
	/**
	 * List products.
	 *
	 * @param {Object} params
	 */

	self.list = (params: { q: string }) => {
		Analytics.search(params.q);
		return $http
			.post(localized.apiURL + '/catalog/search/new', params)
			.then(function (resp: any) {
				Analytics.viewSearchResults(params.q, resp.data.product_briefs);
				return resp;
			});
	};
	/**
	 * List more products.
	 *
	 * @param {Object} params
	 */

	self.listMore = function (productBriefs: any[]) {
		const params = {
			products: productBriefs,
		};
		return $http.post(localized.apiURL + '/catalog/product/briefs', params);
	};
	/**
	 * Add product review.
	 *
	 * @param {number} productId
	 * @param {Object} reviewForm
	 */

	self.addReview = function (productId: number, reviewForm: any) {
		const params = {
			product_id: productId,
		};
		angular.forEach(reviewForm, function (value, key) {
			params[key] = value;
		});
		return $http
			.post(localized.apiURL + '/account/product-review/modify', params)
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Flag reviews as helpful or not.
	 *
	 * @param {number}  productId
	 * @param {number}  reviewId
	 * @param {boolean} isHelpful
	 * @return {Object}
	 */

	self.helpfulRating = function (
		productId: number,
		reviewId: number,
		isHelpful: boolean
	) {
		const params = {
			product_id: productId,
			review_id: reviewId,
			helpful: isHelpful,
		};
		return $http
			.post(localized.apiURL + '/account/product-review/rate', params)
			.then(function (resp) {
				self.reviews = resource.reviews;
				return resp;
			});
	};

	self.appendRecent = function (product: any) {
		let viewed = false;
		angular.forEach(self.recentlyViewed, function (value) {
			if (value.product_id === product.product_id) {
				viewed = true;
			}
		});

		if (!viewed) {
			if (self.recentlyViewed.length < 12) {
				self.recentlyViewed.push(product);
			} else if (self.recentlyViewed.length === 12) {
				self.recentlyViewed.shift();
				self.recentlyViewed.push(product);
			}

			localStorage.setItem(
				'recentlyViewed',
				JSON.stringify(self.recentlyViewed)
			);
		}
	};

	self.categories = function (id: number) {
		const params = {
			id,
		};
		return $http({
			url: localized.apiURL + '/catalog/category/list',
			method: 'POST',
			params,
		}).then(function (resp) {
			return resp.data;
		});
	};

	self.viewCategory = function (catId: number, searchParams: any) {
		const req = {
			url: localized.apiURL + '/catalog/category/' + catId,
			method: 'GET',
			params: searchParams,
		};
		return $http(req).then(function (resp) {
			return resp.data;
		});
	};

	self.reviews = resource.reviews;
	return this;
}
