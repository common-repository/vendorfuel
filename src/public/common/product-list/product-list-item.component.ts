import angular from 'angular';
import template from './product-list-item.html';

/**
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('productListItem', {
		bindings: {
			product: '<',
			viewAs: '<',
		},
		controller: ProductListItemController,
		template,
	});

	ProductListItemController.$inject = ['Cart', 'User'];

	/**
	 * @param {Object} Cart VendorFuel service.
	 * @param {Object} User VendorFuel service.
	 */
	function ProductListItemController(Cart, User) {
		const vm = this;
		this.addQty = 1;
		vm.isSignedIn = User.isAuthed && User.email;
		vm.hasDisabledGuests =
			localized.settings.store.options['Disable Guests'];
		vm.productSlug = localized.settings.general.productSlug || 'products';
		vm.isAddingToCart = false;

		/**
		 * Initialization
		 */
		this.$onInit = () => {
			if (
				!vm.product.image &&
				Object.values(vm.product.images.length > 0)
			) {
				vm.product.image = Object.values(vm.product.images)[0];
			}
		};

		/**
		 * @param {Object} product Product
		 * @return {number} Available quantity.
		 */
		this.getAvailableQty = (product) => {
			const { available_qty: qtyInStock, cart_qty: qtyInCart } = product;
			if (Number.isInteger(qtyInStock)) {
				if (qtyInStock - qtyInCart >= 0) {
					return qtyInStock - qtyInCart;
				}
				return 0;
			}
		};

		/**
		 * @param {number} productId Product ID.
		 */
		this.onClickAdd = (productId) => {
			const qty = this.addQty;
			vm.isAddingToCart = true;
			Cart.add(productId, qty)
				.then((response) => {
					if (!response.data.errors.length) {
						if (vm.product.cart_qty) {
							vm.product.cart_qty = vm.product.cart_qty + qty;
						} else {
							vm.product.cart_qty = qty;
						}

						if (vm.product.available_qty) {
							vm.product.available_qty =
								vm.product.available_qty - qty;
						}
					}
				})
				.finally(() => {
					vm.isAddingToCart = false;
				});
		};

		/**
		 * Prevent user from entering non-digit characters.
		 *
		 * @param {number} e
		 */
		this.onKeydown = (e: KeyboardEvent) => {
			// Prevent quantity from becoming larger than 1000 or the product quantity
			const max = vm.product.available_qty || 1000;
			if (vm.addQty) {
				const newAddQty = Number(vm.addQty.toString() + e.key);
				if (newAddQty > max) {
					e.preventDefault();
					// Instead of just preventing user input, set the addQty to the max and then display a message to the user.
					vm.addQty = max;
					vm.hasMaxQty = true;
				}
			}

			// Prevent user from entering non-digit characters.
			if (
				e.key !== 'Backspace' &&
				e.key !== 'ArrowUp' &&
				e.key !== 'ArrowDown' &&
				isNaN(Number(e.key))
			) {
				e.preventDefault();
			}
		};
	}
})();
