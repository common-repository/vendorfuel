/**
 * @namespace savedCartAddToCart
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('savedCartAddToCart', {
		templateUrl: 'savedCartAddToCart.html',
		bindings: {
			item: '=',
		},
		controller: SavedCartAddToCartController,
	});

	SavedCartAddToCartController.$inject = ['Cart', 'Utils'];

	/**
	 * @param {Object} Cart  VendorFuel service
	 * @param {Object} Utils VendorFuel service
	 */
	function SavedCartAddToCartController(Cart, Utils) {
		const vm = this;
		vm.$onInit = $onInit;
		vm.isAddingToCart = false;
		vm.updateQty = updateQty;
		vm.onAddToCart = onAddToCart;

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.pageUrls = {
				cart: Utils.getPageUrl('cart'),
			};
		}

		/**
		 * @function onAddToCart
		 * @param {number} productId Product ID
		 * @param {number} qty       Quantity
		 */
		function onAddToCart(productId, qty) {
			vm.isAddingToCart = true;
			Cart.add(productId, qty)
				.then((response) => {
					if (response.data.errors.length === 0) {
						vm.item.cartQty =
							response.data.cart.items[productId].qty;
						vm.item.realAvailableQty =
							vm.item.stockQty - vm.item.cartQty;
						vm.item.savedCartQty =
							vm.item.savedCartQty > vm.item.realAvailableQty
								? 1
								: vm.item.savedCartQty;
					} else {
						vm.errors = response.data.errors;
					}
					vm.isAddingToCart = false;
				})
				.finally(() => {
					vm.isAddingToCart = false;
				});
		}

		/**
		 * @function updateQty
		 * @param {number} qty Quantity
		 */
		function updateQty(qty) {
			vm.item.savedCartQty = qty;
		}
	}
})();
