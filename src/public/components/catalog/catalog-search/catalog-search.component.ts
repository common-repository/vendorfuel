import angular from 'angular';
import template from './catalog-search.component.html';

(function () {
	'use strict';

	angular.module('vfApp').component('catalogSearch', {
		template,
		controller: SearchController,
	});

	SearchController.$inject = ['$location', '$rootScope', 'catalogService'];

	/**
	 * @param {Object} $location      Angular service
	 * @param {Object} $rootScope     Angular service
	 * @param {Object} catalogService Catalog service
	 */
	function SearchController($location, $rootScope, catalogService) {
		this.isLoading = true;
		this.query = '';
		this.placeholder = 'Search for products';
		this.buttonLabel = 'Search';

		$rootScope.$on('catalog.data:init', () => {
			this.isLoading = false;
			this.query = catalogService.getQuery();
			this.placeholder = $location.path().includes('catalog')
				? 'Search for products'
				: `Search within ${catalogService.getTitle()}`;
			this.buttonLabel = $location.path().includes('catalog')
				? 'Search'
				: `Search in ${catalogService.getTitle()}`;
		});

		$rootScope.$on('catalog.params:changes', () => {
			this.isLoading = true;
		});

		$rootScope.$on('catalog.data:changes', () => {
			this.isLoading = false;
			this.query = catalogService.getQuery();
		});

		this.submit = (query) => {
			$location.search('q', query);
			$location.search('pg', null);
			catalogService.changeQuery(query);
		};
	}
})();
