import angular from 'angular';
import template from './saved-cart-item.component.html';

/**
 * @namespace savedCartItem
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('savedCartItem', {
		bindings: {
			item: '<',
			onDelete: '&',
		},
		controller,
		template,
	});

	function controller() {
		const vm = this;
		vm.$onInit = $onInit;

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.productSlug =
				localized.settings.general.product_slug || 'products';
		}

		/**
		 * @function delete
		 */
		vm.delete = () => {
			vm.onDelete({
				item: vm.item,
			});
		};
	}
})();
