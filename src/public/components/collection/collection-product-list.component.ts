/**
 * Collection Product List Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('collectionProductList', {
		bindings: {
			products: '<',
		},
		controller: ProductListController,
		templateUrl: 'collectionProductList.html',
	});

	/**
	 */
	function ProductListController() {
		const vm = this;
		vm.viewAs = 'grid';
	}
})();
