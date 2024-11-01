/**
 * Search Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfSearch', {
		controller: SearchController,
		templateUrl: 'vfSearch.html',
	});

	SearchController.$inject = ['Products'];

	/**
	 * @namespace SearchController
	 * @param {Object} Products VendorFuel service
	 * @description Simple search box to fetch products and return name, url and SKU. Ideal for
	 * @memberof Components
	 */
	function SearchController(Products) {
		const vm = this;
		vm.numResults = 0;
		vm.productSlug = localized.settings.general.product_slug || 'products';
		vm.submit = submit;

		/**
		 * @name submit
		 * @param {string} q Query to search for.
		 * @memberof Components.SearchController
		 */
		function submit(q) {
			vm.isInProgress = true;
			const params = {
				q,
			};

			Products.list(params)
				.then((resolve) => {
					vm.products = getProducts(resolve.data.product_briefs);
					vm.numResults = resolve.data.num_results;
				})
				.catch((reject) => {
					console.error(reject);
				})
				.finally(function () {
					vm.isInProgress = false;
				});
		}

		/**
		 * @param {Array} data Product data
		 * @return {Array} Products
		 */
		function getProducts(data) {
			const products = data.map((product) => {
				return {
					url: `/${vm.productSlug}/${product.slug}`,
					name: product.description,
					price: product.price,
					sku: product.sku,
					uom: product.uom,
					imageUrl: getProductImage(product.images),
				};
			});
			return products;
		}

		/**
		 * @param {Object} images Images data
		 * @return {string} Image URL
		 */
		function getProductImage(images) {
			if (!images || images.length === 0) {
				return '/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
			}
			return Object.values(images)[0].thumb_url;
		}
	}
})();
