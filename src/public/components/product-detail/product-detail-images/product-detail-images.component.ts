import template from './product-detail-images.component.html';
declare const angular: ng.IAngularStatic;

/**
 * @namespace productDetailImages
 * @description Product images component
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('productDetailImages', {
		template,
		bindings: {
			description: '<',
			images: '<',
		},
		controller: ImagesController,
	});

	/**
	 */
	function ImagesController() {
		const vm = this;
		this.placeholder =
			'/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
		vm.$onInit = onInit;

		/**
		 */
		function onInit() {
			vm.images = convertImages(vm.images);
		}

		/**
		 * @function convertImages
		 * @param {Object} images Object containing keyed image objects.
		 * @return {Array} Array containing image objects.
		 */
		function convertImages(images) {
			return Object.values(images);
		}
	}
})();
