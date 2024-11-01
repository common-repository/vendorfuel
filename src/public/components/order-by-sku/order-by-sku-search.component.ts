import angular from 'angular';
import template from './order-by-sku-search.component.html';

/**
 * Search Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('orderBySkuSearch', {
		controller: SearchController,
		template,
	});

	SearchController.$inject = ['Alerts', 'Products'];

	/**
	 * @param {Object} Alerts   VendorFuel service.
	 * @param {Object} Products VendorFuel service.
	 */
	function SearchController(Alerts, Products) {
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
				.then((response) => {
					vm.products = processProducts(response.data.product_briefs);
					vm.numResults = response.data.num_results;
					if (!vm.numResults) {
						Alerts.warning(
							q
								? `No results found for '${q}'.`
								: 'No results found.'
						);
					}
				})
				.catch((reject) => {
					console.error(reject);
				})
				.finally(() => {
					vm.isInProgress = false;
				});
		}

		/**
		 * @param {Array} data Products
		 * @return {Array} Products
		 */
		function processProducts(data) {
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
		 * @param {Array} images Images
		 * @return {string} Image source.
		 */
		function getProductImage(images) {
			if (!images || images.length === 0) {
				return '/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
			}
			return Object.values(images)[0].thumb_url;
		}
	}
})();
