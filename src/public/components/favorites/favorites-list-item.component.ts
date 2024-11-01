/**
 * Favorites List Item Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('favoritesListItem', {
		bindings: {
			item: '<',
			index: '<',
		},
		controller: FavoritesListItemController,
		require: {
			listController: '^favoritesList',
		},
		templateUrl: 'favoritesListItem.html',
	});

	FavoritesListItemController.$inject = ['Cart', 'Favorites'];

	/**
	 * @param {Object} Cart      VendorFuel service
	 * @param {Object} Favorites VendorFuel service
	 */
	function FavoritesListItemController(Cart, Favorites) {
		const vm = this;
		vm.$onInit = $onInit;
		vm.addToCart = addToCart;
		vm.isInProgress = false;
		vm.removeFavorite = removeFavorite;
		vm.updateQty = updateQty;
		vm.updateSelection = updateSelection;

		/**
		 * @name $onInit
		 * @memberof Components.FavoritesListItemController
		 */
		function $onInit() {
			vm.item.isChecked = false;
			vm.productSlug =
				localized.settings.general.product_slug || 'products';
		}

		/**
		 * @name addToCart
		 * @param {number} qty       Quantity
		 * @param {number} productId Product ID.
		 * @memberof Components.FavoritesListItemController
		 */
		function addToCart(qty, productId) {
			vm.isInProgress = true;
			Cart.add(productId, qty)
				.then(function () {
					vm.item.cart_qty = qty;
				})
				.catch((reject) => {
					console.error(reject);
				})
				.finally(() => {
					vm.isInProgress = false;
				});
		}

		/**
		 * @name removeFavorite
		 * @param {number} productId Product ID
		 * @param {number} index     Index
		 * @memberof Components.FavoritesListItemController
		 */
		function removeFavorite(productId, index) {
			Favorites.remove(productId).then(function () {
				vm.listController.favorites.splice(index, 1);
			});
		}

		/**
		 * @name updateQty
		 * @param {number} qty       Quantity.
		 * @param {number} productId Product ID.
		 * @memberof Components.FavoritesListItemController
		 */
		function updateQty(qty, productId) {
			vm.isInProgress = true;
			Cart.update(qty, productId)
				.then(function (resolve) {
					if (
						resolve.data.cart &&
						resolve.data.cart.items[productId]
					) {
						vm.item.cart_qty =
							resolve.data.cart.items[productId].qty;
					} else {
						vm.item.cart_qty = 0;
					}
				})
				.finally(() => {
					vm.isInProgress = false;
				});
		}

		/**
		 * @name updateSelection
		 * @memberof Components.FavoritesListItemController
		 */
		function updateSelection() {
			vm.listController.toggleSelected(vm.index);
		}
	}
})();
