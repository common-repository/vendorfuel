/**
 * Catalog Favorite Button Component
 *
 * @memberof Components
 */
(function () {
	'use strict';

	const template = `
	<button class="btn btn-link px-2 me-1"
		ng-if="$ctrl.isLoggedIn"
		ng-click="$ctrl.onClickFavorite($ctrl.product['product_id'])">
		<i ng-class="['bi',
			{'bi-heart': !$ctrl.product.favorite,
			'bi-heart-fill': $ctrl.product.favorite}]"
			ng-hide="$ctrl.isInProgress"></i>
		<span class="visually-hidden">
			{{ $ctrl.product.favorite ? 'Remove from' : 'Add to' }} Favorites
		</span>
		<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
			ng-show="$ctrl.isInProgress"></span>
	</button>
	`;

	angular.module('vfApp').component('productListItemFavoriteButton', {
		bindings: {
			product: '<',
		},
		controller: FavoriteController,
		template,
	});

	FavoriteController.$inject = ['Favorites', 'User'];

	/**
	 * @param {Object} Favorites VendorFuel service.
	 * @param {Object} User      VendorFuel service.
	 */
	function FavoriteController(Favorites, User) {
		const vm = this;
		vm.$onInit = $onInit;
		vm.onClickFavorite = onClickFavorite;

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.isLoggedIn = User.isAuthed && User.email ? true : false;
			vm.isInProgress = false;
		}

		/**
		 * @param {number} productId Product ID
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
