/**
 * Home Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfHome', {
		controller: HomeController,
	});

	HomeController.$inject = ['$rootScope', 'User', 'Utils'];

	/**
	 * @param {Object} $rootScope AngularJS service
	 * @param {Object} User       VendorFuel service
	 * @param {Object} Utils      VendorFuel service
	 */
	function HomeController($rootScope, User, Utils) {
		if (
			User.isAuthed &&
			$rootScope.punchoutOnly === true &&
			!User.isGuest
		) {
			Utils.goToPage(Utils.getPageUrl('welcome'));
		} else {
			Utils.goToPage(Utils.getPageUrl('catalog'));
		}
	}
})();
