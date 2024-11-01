/**
 * Footer Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfHelper', {
		controller: HelperController,
	});

	HelperController.$inject = ['$cookies', '$rootScope', 'User', 'Utils'];

	/**
	 * @param {Object} $cookies   AngularJS service
	 * @param {Object} $rootScope AngularJS service
	 * @param {Object} User       VendorFuel service
	 * @param {Object} Utils      VendorFuel service
	 */
	function HelperController($cookies, $rootScope, User, Utils) {
		$rootScope.cartQty = 0;
		$rootScope.currentYear = new Date();
		$rootScope.loadingText = 'Let me grab that...';
		$rootScope.punchoutOnly = $cookies.get('vf.user.punchoutOnly');
		$rootScope.user = User;

		const vm = this;
		vm.$onInit = $onInit;

		/**
		 */
		function $onInit() {
			if (Utils.urlParser.param('auth_token')) {
				$cookies.put(
					'vf.auth.token',
					Utils.urlParser.param('auth_token')
				);
				User.loadCustomer().then(function () {
					window.location.assign(Utils.getPageUrl('catalog'));
				});
			}

			if (window.location.pathname.split('/')[1] === 'cc-return') {
				$rootScope.isCCReturn = true;
			} else {
				$rootScope.isCCReturn = false;
			}

			if (!User.isAuthed) {
				if ($cookies.get('vf.user.defaultBillingProfile')) {
					$cookies.remove('vf.user.defaultBillingProfile');
				}
				if ($cookies.get('vf.user.defaultShippingProfile')) {
					$cookies.remove('vf.user.defaultShippingProfile');
				}
			}
		}
	}
})();
