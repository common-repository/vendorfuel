import angular from 'angular';
import template from './catalog-pagination.component.html';

/**
 * @namespace catalogPagination
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('catalogPagination', {
		template,
		controller: PaginationController,
	});

	PaginationController.$inject = [
		'$location',
		'$rootScope',
		'catalogService',
	];

	/**
	 * @param {Object} $location      Angular service
	 * @param {Object} $rootScope     Angular service
	 * @param {Object} catalogService Catalog service
	 */
	function PaginationController($location, $rootScope, catalogService) {
		const vm = this;
		vm.isLoading = true;
		vm.onClick = onClick;
		vm.pagination = [];

		$rootScope.$on('catalog.params:changes', () => {
			vm.isLoading = true;
		});

		$rootScope.$on('catalog.data:changes', () => {
			vm.pagination = catalogService.getPagination();
			vm.currentPage = catalogService.getCurrentPage();
			vm.totalPages = catalogService.getTotalPages();
			vm.isLoading = false;
		});

		/**
		 * @name onClick
		 * @param {number} page Page number to advance to.
		 */
		function onClick(page) {
			window.scrollTo(0, 0);
			$location.search('pg', page);
			$rootScope.$emit('catalog.params:changes');
			vm.currentPage = page;
		}
	}
})();
