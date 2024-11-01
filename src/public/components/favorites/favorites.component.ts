import template from './favorites.component.html';
/**
 * Favorites Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfFavorites', {
		controller: FavoritesController,
		template,
	});

	FavoritesController.$inject = ['$location', 'User', 'Utils'];

	/**
	 * @param {Object} $location
	 * @param {Object} User      VendorFuel service
	 * @param {Object} Utils     VendorFuel service
	 */
	function FavoritesController($location, User, Utils) {
		const vm = this;
		vm.isSignedIn = User.isAuthed && User.email;
		vm.pageUrls = {
			login: Utils.getPageUrl('login', { redirect_to: $location.path() }),
			register: Utils.getPageUrl('register'),
		};
	}
})();
