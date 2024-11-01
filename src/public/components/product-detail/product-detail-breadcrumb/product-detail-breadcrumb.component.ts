import angular from 'angular';
import template from './product-detail-breadcrumb.component.html';

/**
 * @namespace productDetailBreadcrumb
 * @memberof Components
 * @description Component to show the breadcrumb
 */
(function () {
	'use strict';

	angular.module('vfApp').component('productDetailBreadcrumb', {
		template,
		bindings: {
			breadcrumb: '<',
		},
		controller: BreadcrumbController,
	});

	/**
	 */
	function BreadcrumbController() {
		const vm = this;

		vm.$onInit = function () {
			vm.list = getBreadcrumb(vm.breadcrumb);
		};

		/**
		 * @function getBreadcrumb
		 * @param {Array} breadcrumb Breadcrumb
		 * @return {Array} Breadcrumb list
		 */
		function getBreadcrumb(breadcrumb) {
			const list = [
				{
					title: 'Catalog',
					link: '/catalog',
				},
			];

			angular.forEach(breadcrumb, function (item) {
				list.push({
					title: item.title,
					link: `/categories/${item.slug}`,
				});
			});

			return list;
		}
	}
})();
