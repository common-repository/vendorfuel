import angular from 'angular';
import template from './reset-password.component.html';
/**
 * Reset Password Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('resetPassword', {
		controller: ResetPasswordController,
		template,
	});

	ResetPasswordController.$inject = ['$location', 'Alerts', 'User', 'Utils'];

	/**
	 *
	 * @param {Object} $location AngularJS service
	 * @param {Object} Alerts    VendorFuel service
	 * @param {Object} User      VendorFuel service
	 * @param {Object} Utils     VendorFuel service
	 */
	function ResetPasswordController($location, Alerts, User, Utils) {
		this.hasAPIKey = localized.settings.general.api_key;

		const vm = this;
		vm.alertsList = Alerts.list;
		vm.isInProgress = false;
		vm.forgotPasswordUrl = Utils.getPageUrl('forgot-password');
		vm.getPasswordStrength = getPasswordStrength;
		vm.onClick = onClick;
		this.pageUrls = {
			login: Utils.getPageUrl('login'),
			forgotPassword: Utils.getPageUrl('forgot-password'),
		};

		this.$onInit = () => {
			if (this.hasAPIKey) {
				validatePasswordReset();
			}
		};

		/**
		 * @function getPasswordStrength
		 * @param {string} password Password
		 * @return {number} Password strength
		 */
		function getPasswordStrength(password) {
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
		}

		/**
		 */
		function validatePasswordReset() {
			vm.isLoading = true;
			const { code, auth } = $location.search();

			User.validatePasswordReset(code, auth)
				.then((resolve) => {
					if (resolve.data.errors.length === 0) {
						vm.isValidated = true;
					}
				})
				.catch((reject) => {
					console.error(reject);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

		/**
		 */
		function onClick() {
			vm.isInProgress = true;
			const { code, auth } = $location.search();
			const question = '';
			const answer = '';
			const pass = vm.password;
			const verify = vm.passwordConfirmation;

			User.resetPassword(code, auth, question, answer, pass, verify)
				.then((resolve) => {
					if (resolve.data.errors.length === 0) {
						Alerts.info('Redirecting to Sign In page...');
						Utils.goToPage(Utils.getPageUrl('login'));
					}
				})
				.catch((reject) => {
					console.error(reject);
				})
				.finally(function () {
					vm.isInProgress = false;
					vm.isSubmitted = true;
				});
		}
	}
})();
