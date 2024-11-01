/**
 * Collection Pagination Component
 */
(function () {
	'use strict';

	angular.module('vfApp').component('collectionPagination', {
		bindings: {
			data: '<',
			onChange: '&',
		},
		controller: PaginationController,
		templateUrl: 'collectionPagination.html',
	});

	PaginationController.$inject = ['$location'];

	/**
	 * @param {Object} $location Angular service {@link https://docs.angularjs.org/api/ng/service/$location}
	 */
	function PaginationController($location) {
		const vm = this;
		vm.changePage = changePage;

		/**
		 * @param {Object} page Page number
		 * @param {Object} e    Click event
		 */
		function changePage(page, e) {
			if (e) {
				e.preventDefault();
			}
			$location.search('pg', page);
			vm.onChange({ page });
		}
	}
})();
