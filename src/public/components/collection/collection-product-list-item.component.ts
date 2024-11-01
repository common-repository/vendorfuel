/**
 * Collection Product List Item Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('collectionProductListItem', {
		bindings: {
			product: '<',
			viewAs: '<',
		},
		controller: ProductListItemController,
		templateUrl: 'collectionProductListItem.html',
	});

	ProductListItemController.$inject = ['Cart', 'User'];

	/**
	 * @param {Object} Cart VendorFuel service.
	 * @param {Object} User VendorFuel service.
	 */
	function ProductListItemController(Cart, User) {
		const vm = this;
		vm.getAvailableQty = getAvailableQty;
		vm.hasDisabledGuests =
			localized.settings.store.options['Disable Guests'];
		vm.isAddingToCart = false;
		vm.isSignedIn = User.isAuthed && User.email;
		vm.onClickAdd = onClickAdd;
		vm.productSlug = localized.settings.general.product_slug || 'products';

		/**
		 * @param {Object} product Product
		 * @return {number} Available quantity.
		 */
		function getAvailableQty(product) {
			const { available_qty: qtyInStock, cart_qty: qtyInCart } = product;
			if (Number.isInteger(qtyInStock)) {
				if (qtyInStock - qtyInCart >= 0) {
					return qtyInStock - qtyInCart;
				}
				return 0;
			}
		}

		/**
		 * @param {number} productId Product ID.
		 */
		function onClickAdd(productId) {
			const qty = 1;
			vm.isAddingToCart = true;
			Cart.add(productId, qty)
				.then(function () {
					if (vm.product.cart_qty) {
						vm.product.cart_qty = vm.product.cart_qty + qty;
					} else {
						vm.product.cart_qty = qty;
					}

					if (vm.product.available_qty) {
						vm.product.available_qty =
							vm.product.available_qty - qty;
					}
				})
				.finally(function () {
					vm.isAddingToCart = false;
				});
		}
	}
})();
