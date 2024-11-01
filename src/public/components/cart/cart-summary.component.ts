import template from './cart-summary.component.html';
declare const angular: ng.IAngularStatic;

/**
 * Cart Summary Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	angular
		.module( 'vfApp' )
		.component( 'cartSummary', {
			template,
			bindings: {
				totalAmount: '<',
				cartCount: '<',
				cart: '<',
			},
			controller: CartSummaryController,
		} );

	CartSummaryController.$inject = [
		'Utils',
	];

	/**
	 * @param {Object} Utils VendorFuel service
	 */
	function CartSummaryController(
		Utils,
	) {
		const vm = this;
		vm.$onInit = $onInit;

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.pageUrls = {
				checkout: Utils.getPageUrl( 'checkout' ),
			};
		}
	}
}() );
