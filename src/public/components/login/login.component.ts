import angular from 'angular';
import template from './login.component.html';

/**
 * Login Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfLogin', {
		controller: LoginController,
		template,
	});

	LoginController.$inject = [
		'$cookies',
		'$location',
		'$rootScope',
		'$window',
		'Alerts',
		'User',
		'Utils',
	];

	/**
	 * @param {Object} $cookies   AngularJS service
	 * @param {Object} $location  service
	 * @param {Object} $rootScope AngularJS service
	 * @param {Object} $window    AngularJS service
	 * @param {Object} Alerts     VendorFuel service
	 * @param {Object} User       VendorFuel service
	 * @param {Object} Utils      VendorFuel service
	 */
	function LoginController(
		$cookies,
		$location,
		$rootScope,
		$window,
		Alerts,
		User,
		Utils
	) {
		const vm = this;
		vm.alertsList = Alerts.list;
		vm.customer = {};
		vm.forgotPasswordUrl = Utils.getPageUrl('forgot-password');
		vm.isSigningIn = false;
		vm.isLoggedIn = false;
		vm.referrer = Utils.urlParser.param('referrer');
		vm.showPassword = false;
		vm.utils = Utils;
		this.pageUrls = {
			forgotPassword: Utils.getPageUrl('forgot-password'),
			register: Utils.getPageUrl('register'),
		};

		/**
		 * Initialization
		 */
		this.$onInit = () => {
			if (User.email && $location.search().change_pw) {
				this.isForcingPasswordUpdate = true;
			} else if (User.email) {
				Utils.goToPage(Utils.getPageUrl('welcome'));
			}
		};

		this.toggleShowPassword = () => {
			vm.showPassword = !vm.showPassword;
		};

		this.getPasswordStrength = (password) => {
			const points = 20;
			const val = password.$viewValue;
			let strength = 0;

			if (val) {
				if (val.length > 0) {
					strength += points;
				}
				if (val.length >= 8) {
					strength += points;
				}
				if (val.match(/[A-Z]+/)) {
					strength += points;
				}
				if (val.match(/\d+/)) {
					strength += points;
				}
				if (val.match(/[!@#$%^&*-]+/)) {
					strength += points;
				}
			}
			return strength;
		};

		this.login = () => {
			const userData = vm.customer;
			vm.isSigningIn = true;

			User.login(userData)
				.then((response) => response.data)
				.then((data) => {
					if (data.change_pw) {
						this.forcePasswordUpdate();
					} else if (!data.errors.length) {
						vm.isLoggedIn = true;
						if (User.punchoutOnly) {
							Utils.goToPage(Utils.getPageUrl('welcome'));
						} else if ($location.search().redirect_to) {
							$window.location.assign(
								$location.search().redirect_to
							);
						} else {
							Utils.goToPage($window.location.origin);
						}
					}
				})
				.catch((error) => {
					console.error('Login error', error);
				})
				.finally(() => {
					vm.isSigningIn = false;
				});
		};

		this.forcePasswordUpdate = () => {
			$location.search('change_pw', true);
			this.isForcingPasswordUpdate = true;
		};

		this.submitResetPassword = (password: string) => {
			vm.isInProgress = true;
			User.forcedResetPassword(password).then((response) => {
				if (!response.data.errors.length) {
					vm.isInProgress = false;
					if ($location.search().redirect_to) {
						location.assign($location.search().redirect_to);
					} else {
						location.assign(Utils.getPageUrl('welcome'));
					}
				}
			});
		};
	}
})();
