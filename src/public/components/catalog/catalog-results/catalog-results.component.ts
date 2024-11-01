import angular from 'angular';
import template from './catalog-results.component.html';

/**
 * Catalog Results Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('catalogResults', {
		template,
		controller: ResultsController,
	});

	ResultsController.$inject = ['$rootScope', 'catalogService'];

	/**
	 * @param {Object} $rootScope     Angular service
	 * @param {Object} catalogService Catalog service
	 */
	function ResultsController($rootScope, catalogService) {
		const vm = this;
		vm.isLoading = true;
		vm.max = 1000;
		vm.numResults = 0;
		vm.refreshResults = refreshResults;

		$rootScope.$on('catalog.data:init', () => {
			refreshResults();
		});

		$rootScope.$on('catalog.params:changes', () => {
			vm.isLoading = true;
		});

		$rootScope.$on('catalog.data:changes', () => {
			refreshResults();
		});

		/**
		 */
		function refreshResults() {
			vm.numResults = catalogService.getNumResults();
			vm.query = catalogService.getQuery();
			vm.isLoading = false;
		}
	}
})();
