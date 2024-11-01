import template from './catalog-categories-list.component.html';
declare const angular: ng.IAngularStatic;
/**
 * Catalog Categories List Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	angular
		.module( 'vfApp' )
		.component( 'catalogCategoriesList', {
			template,
			controller: CategoriesListController,
		} );

	CategoriesListController.$inject = [
		'$httpParamSerializer',
		'$location',
		'$rootScope',
		'catalogService',
	];

	/**
	 * @namespace CategoriesListController
	 * @param {Object} $httpParamSerializer AngularJS service.
	 * @param {Object} $location            AngularJS service.
	 * @param {Object} $rootScope           AngularJS service.
	 * @param {Object} catalogService       Catalog factory.
	 * @memberof Components
	 */
	function CategoriesListController(
		$httpParamSerializer,
		$location,
		$rootScope,
		catalogService,
	) {
		const vm = this;
		vm.$onInit = $onInit;
		vm.isLoading = true;
		vm.list = [];

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.catSlug = localized.settings.general.cat_slug || 'categories';

			$rootScope.$on( 'catalog.data:init', () => {
				vm.list = catalogService.getCategories();
				vm.params = getQueryParams();
			} );

			$rootScope.$on( 'catalog.params:changes', () => {
				vm.isLoading = true;
			} );

			$rootScope.$on( 'catalog.data:changes', () => {
				vm.list = catalogService.getCategories();
				vm.params = getQueryParams();
				vm.isLoading = false;
			} );
		}

		/**
		 * @return {string} Query parameters.
		 */
		function getQueryParams() {
			const search = $location.search();
			const params = {
				brand_name: search.brand_name ? search.brand_name : null,
				manufacturer: search.manufacturer ? search.manufacturer : null,
				q: search.q ? search.q : null,
			};
			return ( search.brand_name || search.manufacturer || search.q ) ? `?${ $httpParamSerializer( params ) }` : '';
		}
	}
}() );
