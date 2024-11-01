/**
 * Collection Image Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('collectionImage', {
		bindings: {
			imageTitle: '<',
			imageSrc: '<',
		},
		controller: ImageController,
		templateUrl: 'collectionImage.html',
	});

	/**
	 * @namespace ImageController
	 * @memberof Components
	 */
	function ImageController() {
		const vm = this;
		vm.imgPlaceholder =
			'/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
	}
})();
