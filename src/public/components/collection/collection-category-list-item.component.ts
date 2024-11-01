/**
 * Collection Category List Item Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('collectionCategoryListItem', {
		bindings: {
			category: '<',
		},
		controller: CategoryListItemController,
		templateUrl: 'collectionCategoryListItem.html',
	});

	function CategoryListItemController() {
		const vm = this;
		vm.imgPlaceholder =
			'/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
		vm.catSlug = localized.settings.general.cat_slug || 'categories';
	}
})();
