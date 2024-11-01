import angular from 'angular';
import template from './product-detail-alternate-list.component.html';
/**
 * Alternate Product List Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('productDetailAlternateList', {
		bindings: {
			products: '<',
		},
		controller: ProductListController,
		template,
	});

	function ProductListController() {
		const vm = this;
		vm.productSlug = localized.settings.general.productSlug || 'products';
	}
})();
