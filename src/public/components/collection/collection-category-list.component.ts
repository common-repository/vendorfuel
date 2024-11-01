/**
 * Collection Category List Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('collectionCategoryList', {
		bindings: {
			categories: '<',
		},
		controller: CategoryListController,
		templateUrl: 'collectionCategoryList.html',
	});

	/**
	 * @namespace CategoryListController
	 * @memberof Components
	 */
	function CategoryListController() {
		const vm = this;
		vm.isShowingCategories = false;
		vm.onClickToggle = onClickToggle;

		/**
		 */
		function onClickToggle() {
			jQuery('#collectionCategories').collapse('toggle');
			vm.isShowingCategories = !vm.isShowingCategories;
		}
	}
})();
