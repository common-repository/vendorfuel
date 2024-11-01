import angular from 'angular';
import template from './catalog-title.component.html';
/**
 * Catalog Title Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('catalogTitle', {
		template,
		controller: TitleController,
	});

	TitleController.$inject = ['$rootScope', 'catalogService'];

	/**
	 * @param {Object} $rootScope     Angular service
	 * @param {Object} catalogService Catalog service
	 */
	function TitleController($rootScope, catalogService) {
		this.showSubcategoryCards =
			localized.settings.general.showSubcategoryCards;
		this.description = '';
		this.isLoading = true;
		this.title = 'Catalog';

		$rootScope.$on('catalog.data:init', () => {
			this.title = catalogService.getTitle();
			this.description = catalogService.getDescription();
			this.subcategories = catalogService.getSubcategories();
		});
	}
})();
