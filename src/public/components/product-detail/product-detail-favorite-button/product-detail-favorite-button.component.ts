import angular from 'angular';
import template from './product-detail-favorite-button.component.html';

/**
 * @namespace productDetailFavoriteButton
 * @description Component to add product to favorites list.
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('productDetailFavoriteButton', {
		template,
		bindings: {
			product: '<',
		},
		controller: FavoriteButtonController,
	});

	FavoriteButtonController.$inject = ['Cart', 'User'];

	/**
	 * @param {Object} Cart VendorFuel service
	 * @param {Object} User VendorFuel service
	 */
	function FavoriteButtonController(Cart, User) {
		const vm = this;

		vm.showPrompt = false;
		vm.toggleFavorite = toggleFavorite;
		vm.user = {
			isAuthed: User.isAuthed,
		};

		vm.$onInit = function () {
			vm.isFavorite = vm.product.favorite || false;
		};

		/**
		 * @name toggleFavorite
		 * @description Adds product to favorites using the Cart service, prompts user to log in if logged out.
		 * @memberof Components.AddToFavorites
		 */
		function toggleFavorite() {
			const params = {
				product_id: vm.product.product_id,
			};

			if (vm.user.isAuthed) {
				if (!vm.isFavorite) {
					Cart.addFavorite(params).then(function () {
						vm.isFavorite = true;
					});
				} else {
					Cart.removeFavorite(params).then(function () {
						vm.isFavorite = false;
					});
				}
			} else {
				vm.showPrompt = true;
			}
		}
	}
})();
