import angular from 'angular';
import template from './catalog-breadcrumb.component.html';
/**
 * Catalog Breadcrumb Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('catalogBreadcrumb', {
		template,
		controller: BreadcrumbController,
	});

	BreadcrumbController.$inject = ['$rootScope', 'catalogService'];

	/**
	 * @param {Object} $rootScope     Angular service
	 * @param {Object} catalogService Catalog service
	 */
	function BreadcrumbController($rootScope, catalogService) {
		const vm = this;
		vm.$onInit = onInit;
		vm.base = [
			{
				title: 'Catalog',
				link: '/catalog',
			},
		];
		vm.isLoading = true;

		/**
		 */
		function onInit() {
			vm.list = vm.base;
		}

		$rootScope.$on('catalog.data:init', () => {
			vm.list = vm.base.concat(catalogService.getBreadcrumb());
			vm.isLoading = false;
		});
	}
})();
