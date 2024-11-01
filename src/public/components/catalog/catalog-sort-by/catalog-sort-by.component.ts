import angular from 'angular';
import template from './catalog-sort-by.component.html';
/**
 * @namespace catalogSortBy
 * @memberof Components
 */

(function () {
	'use strict';

	angular.module('vfApp').component('catalogSortBy', {
		template,
		controller: SortByController,
	});

	SortByController.$inject = ['$location', 'catalogService'];

	/**
	 * @param {Object} $location      Angular service
	 * @param {Object} catalogService Catalog service
	 */
	function SortByController($location, catalogService) {
		this.sortByOptions = [
			{
				name: 'Most Relevant',
				value: 'relevance',
				icon: 'bi bi-sort-down',
			},
			{
				name: 'Price Low-High',
				value: 'pricea',
				icon: 'bi bi-sort-numeric-down',
			},
			{
				name: 'Price High-Low',
				value: 'priced',
				icon: 'bi bi-sort-numeric-down-alt',
			},
			{
				name: 'Title Ascending',
				value: 'descriptiona',
				icon: 'bi bi-sort-alpha-down',
			},
			{
				name: 'Title Descending',
				value: 'descriptiond',
				icon: 'bi bi-sort-alpha-down-alt',
			},
		];

		this.$onInit = () => {
			this.orderBy = $location.search().sortby
				? this.sortByOptions.find(
						(element) => element.value === $location.search().sortby
				  )
				: this.sortByOptions[0];
		};

		/**
		 * @param {Object} orderBy Sort by
		 */
		this.change = (orderBy) => {
			this.orderBy = orderBy;
			$location.search('pg', null);
			catalogService.changeSortBy(orderBy);
			$location.search('sortby', orderBy.value);
		};
	}
})();
