/**
 * @namespace savedCartToggleFavorite
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('savedCartToggleFavorite', {
		templateUrl: 'savedCartToggleFavorite.html',
		bindings: {
			productId: '<',
			isFavorite: '<',
		},
		controller: SavedCartFavoriteController,
	});

	SavedCartFavoriteController.$inject = ['Cart', 'User'];

	/**
	 * @param {Object} Cart VendorFuel service
	 * @param {Object} User VendorFuel service
	 */
	function SavedCartFavoriteController(Cart, User) {
		const vm = this;

		vm.title = 'Add to Favorites';
		vm.onToggleFavorite = onToggleFavorite;
		vm.isTogglingFavorite = false;

		/**
		 * @name onToggleFavorite
		 * @memberof Components.AddToFavorites
		 */
		function onToggleFavorite() {
			vm.isTogglingFavorite = true;
			const params = {
				product_id: vm.productId,
			};

			if (User.email) {
				if (!vm.isFavorite) {
					vm.title = 'Adding to Favorites';
					Cart.addFavorite(params).then(function () {
						vm.isFavorite = true;
						vm.title = 'Added to Favorites';
						vm.isTogglingFavorite = false;
					});
				} else {
					vm.title = 'Removing';
					Cart.removeFavorite(params).then(function () {
						vm.isFavorite = false;
						vm.title = 'Add to Favorites';
						vm.isTogglingFavorite = false;
					});
				}
			} else {
				vm.showPrompt = true;
			}
		}
	}
})();
