/**
 * Cart Add to Favorites Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	angular
		.module( 'vfApp' )
		.component( 'cartAddToFavorites', {
			bindings: {
				isFavorite: '<',
				productId: '<',
			},
			controller: FavoriteController,
			templateUrl: 'cartAddToFavorites.html',
		} );

	FavoriteController.$inject = [
		'Favorites',
		'User',
	];

	/**
	 * @namespace FavoriteController
	 * @param {Object} Favorites VendorFuel service.
	 * @param {Object} User      VendorFuel service.
	 * @memberof Components
	 */
	function FavoriteController(
		Favorites,
		User,
	) {
		const vm = this;
		vm.isInProgress = false;
		vm.isLoggedIn = User.isAuthed && ! User.isGuest;
		vm.toggleFavorite = toggleFavorite;

		/**
		 * @name toggleFavorite
		 * @param {number} productId Product ID.
		 * @memberof Components.FavoriteController
		 */
		function toggleFavorite( productId ) {
			vm.isInProgress = true;
			if ( vm.isFavorite ) {
				Favorites.remove( productId )
					.then( function() {
						vm.isFavorite = false;
						vm.isInProgress = false;
					} );
			} else {
				Favorites.add( productId )
					.then( function() {
						vm.isFavorite = true;
						vm.isInProgress = false;
					} );
			}
		}
	}
}() );
