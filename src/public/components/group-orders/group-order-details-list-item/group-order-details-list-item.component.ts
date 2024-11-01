import template from './group-order-details-list-item.html';

/**
 * Order Details List Item Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('groupOrderDetailsListItem', {
		bindings: {
			item: '<',
			orderId: '<?',
		},
		controller: OrderDetailsListItemController,
		template,
	});

	OrderDetailsListItemController.$inject = ['Cart', 'Favorites', 'User'];

	/**
	 * @param {Object} Cart      VendorFuel service
	 * @param {Object} Favorites VendorFuel service
	 * @param {Object} User      VendorFuel service
	 */
	function OrderDetailsListItemController(Cart, Favorites, User) {
		const vm = this;
		vm.$onInit = $onInit;
		vm.onClickFavorite = onClickFavorite;
		vm.onClickAddToCart = onClickAddToCart;
		vm.onClickReturnItem = onClickReturnItem;
		vm.onClickSubmitReturn = onClickSubmitReturn;

		/**
		 */
		function $onInit() {
			vm.isFavorite = vm.item.favorite;
		}

		/**
		 */
		function onClickAddToCart() {
			vm.isAddingToCart = true;
			const params = [vm.item.product_id, vm.item.qty];

			Cart.add(...params).then(function () {
				vm.isAddingToCart = false;
			});
		}

		/**
		 */
		function onClickFavorite() {
			const productId = vm.item.product_id;
			vm.isTogglingFavorite = true;
			if (vm.isFavorite) {
				Favorites.remove(productId).then(function () {
					vm.isFavorite = false;
					vm.isTogglingFavorite = false;
				});
			} else {
				Favorites.add(productId).then(function () {
					vm.isFavorite = true;
					vm.isTogglingFavorite = false;
				});
			}
		}

		/**
		 */
		function onClickReturnItem() {
			vm.isReturningItem = true;
		}

		/**
		 */
		function onClickSubmitReturn() {
			vm.isSubmittingReturn = true;
			const params = [vm.item.purch_id, vm.notes, vm.reason, vm.item.qty];

			User.addRma(...params).then(function () {
				vm.isSubmittingReturn = false;
				vm.isReturningItem = false;
			});
		}
	}
})();
