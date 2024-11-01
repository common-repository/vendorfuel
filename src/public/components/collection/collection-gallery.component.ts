/**
 * Collection Gallery Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfCollectionGallery', {
		bindings: {
			collectionId: '<',
		},
		controller: GalleryController,
		templateUrl: 'vfCollectionGallery.html',
	});

	GalleryController.$inject = ['Alerts', 'Collections'];

	/**
	 * @namespace GalleryController
	 * @param {Object} Alerts      VendorFuel service
	 * @param {Object} Collections VendorFuel service
	 * @memberof Components
	 */
	function GalleryController(Alerts, Collections) {
		const vm = this;
		vm.$onInit = onInit;
		vm.isLoading = true;

		/**
		 * @name onInit
		 * @memberof Components.GalleryController
		 */
		function onInit() {
			if (vm.collectionId) {
				const { collectionId } = vm;
				getCollection(collectionId);
			}
		}

		/**
		 * @name getCollection
		 * @param {number} id Collection ID.
		 * @memberof Components.GalleryController
		 */
		function getCollection(id) {
			const params = {
				col_id: id,
				rpp: 16,
			};

			Collections.viewCollection(params)
				.then((data) => {
					if (!data.errors.length) {
						vm.collection = data.collection;
						vm.products = data.collection.products.data.filter(
							(product) => product.image
						);
					} else {
						data.errors.forEach((error) => Alerts.errors(error));
					}
				})
				.catch((reject) => {
					console.error(reject);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}
	}
})();
