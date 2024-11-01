import template from './welcome.component.html';
/**
 * Welcome Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfWelcome', {
		controller: WelcomeController,
		template,
	});

	WelcomeController.$inject = ['User', 'Utils'];

	/**
	 * @param {Object} User  VendorFuel service
	 * @param {Object} Utils VendorFuel service
	 */
	function WelcomeController(User, Utils) {
		const vm = this;
		vm.$onInit = $onInit;

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.cartCount = User.cart_count;
			vm.cartUrl = Utils.getPageUrl('cart');
			vm.hasPunchoutEnabled = User.punchoutOnly;
			vm.isSignedIn = User.isAuthed && User.email;
			vm.userName = User.name;

			checkAuth();
		}

		/**
		 * Check authentication
		 */
		function checkAuth() {
			if (!User.isAuthed) {
				User.redirectToLogin();
			}
		}
	}
})();
