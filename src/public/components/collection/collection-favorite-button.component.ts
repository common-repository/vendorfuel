/**
 * Collection Favorite Button Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('collectionFavoriteButton', {
		bindings: {
			product: '<',
		},
		controller: FavoriteController,
		templateUrl: 'collectionFavoriteButton.html',
	});

	FavoriteController.$inject = ['Favorites', 'User'];

	/**
	 * @param {Object} Favorites VendorFuel service.
	 * @param {Object} User      VendorFuel service.
	 */
	function FavoriteController(Favorites, User) {
		const vm = this;
		vm.isLoggedIn = User.isAuthed && User.email ? true : false;
		vm.onClickFavorite = onClickFavorite;
		vm.isInProgress = false;

		/**
		 * @param {number} productId Product ID.
		 */
		function onClickFavorite(productId) {
			vm.isInProgress = true;
			if (!vm.product.favorite) {
				Favorites.add(productId).then(function () {
					updateFavoriteState();
				});
			} else {
				Favorites.remove(productId).then(function () {
					updateFavoriteState();
				});
			}
		}

		/**
		 */
		function updateFavoriteState() {
			vm.product.favorite = !vm.product.favorite;
			vm.isInProgress = false;
		}
	}
})();
