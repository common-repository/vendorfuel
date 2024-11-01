/**
 * Catalog Image Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	const template = `
	<div class="ratio ratio-1x1">
		<img class="card-img-top lazy" loading="lazy" style="object-fit:contain;" alt=""
			ng-src="{{ $ctrl.imageSrc ? $ctrl.imageSrc : $ctrl.imgPlaceholder }}">
	</div>
	`;

	angular.module('vfApp').component('productListItemImage', {
		bindings: {
			imageTitle: '<',
			imageSrc: '<',
		},
		controller: ImageController,
		template,
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
