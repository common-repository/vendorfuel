/**
 * Collection Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfCollection', {
		templateUrl: 'vfCollection.html',
		bindings: {
			collectionId: '<',
		},
		controller: CollectionController,
	});

	CollectionController.$inject = ['$location', 'Alerts', 'Collections'];

	/**
	 * @param {Object} $location   Angular service {@link https://docs.angularjs.org/api/ng/service/$location}
	 * @param {Object} Alerts      VendorFuel service.
	 * @param {Object} Collections VendorFuel service.
	 */
	function CollectionController($location, Alerts, Collections) {
		const vm = this;
		vm.$onInit = $onInit;
		vm.changePage = changePage;

		/**
		 */
		function $onInit() {
			sanitizeParams();
			vm.params = {
				col_id: vm.collectionId,
				page:
					Number($location.search().pg) > 0
						? $location.search().pg
						: 1,
				rpp: 16,
			};

			if (Number.isInteger(Number(vm.collectionId))) {
				getCollection();
				jQuery('#collectionCategories').collapse();
			} else {
				Alerts.warning('Invalid or missing collection ID.');
				vm.isLoading = false;
			}
		}

		/**
		 * @param {number} page Page number
		 */
		function changePage(page) {
			vm.params.page = page;
			getCollection();
		}

		/**
		 */
		function getCollection() {
			vm.isLoading = true;
			Collections.viewCollection(vm.params)
				.then((data) => {
					// Re-fetch collection if query params had a bad page number
					if (
						data.collection.products.current_page >
						data.collection.products.last_page
					) {
						vm.params.page = data.collection.products.last_page;
						$location.search('pg', vm.params.page);
						getCollection();
					} else {
						vm.title = data.collection.name;
						vm.collection = data.collection;
						vm.description = data.collection.description;
						vm.categories = data.collection_categories;
						vm.products = data.collection.products.data;
						vm.isLoading = false;
					}
				})
				.catch((reject) => {
					console.error(reject);
				});
		}

		/**
		 * Sanitize parameters to allow only clean values
		 */
		function sanitizeParams() {
			if (!Number.isInteger(Number($location.search().pg))) {
				$location.search('pg', null);
			}
		}
	}
})();
