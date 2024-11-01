/**
 * Collection Gallery Item Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('collectionGalleryItem', {
		bindings: {
			item: '<',
		},
		controller: GalleryItemController,
		templateUrl: 'collectionGalleryItem.html',
	});

	function GalleryItemController() {
		const productSlug =
			localized.settings.general.product_slug || 'products';
		const vm = this;
		vm.$onInit = onInit;

		/**
		 * @name onInit
		 * @memberof Components.GalleryItemController
		 */
		function onInit() {
			vm.imageSmall = vm.item.image.small_url;
			vm.imageThumb = vm.item.image.thumb_url;
			vm.title = vm.item.description;
			vm.url = `/${productSlug}/${vm.item.slug}`;
		}
	}
})();
