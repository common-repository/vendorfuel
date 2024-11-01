import template from './account.component.html';
/**
 * Account Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfAccount', {
		controller: AccountController,
		template,
	});

	AccountController.$inject = ['$location', 'Alerts', 'User', 'Utils'];

	/**
	 * @namespace AccountController
	 * @param {Object} $location service
	 * @param {Object} Alerts    VendorFuel service
	 * @param {Object} User      VendorFuel service
	 * @param {Object} Utils     VendorFuel service
	 * @memberof Components
	 */
	function AccountController($location, Alerts, User, Utils) {
		const vm = this;
		vm.$onInit = $onInit;
		vm.alertsList = Alerts.list;
		vm.formPatterns = {
			name: /^[a-zA-Z\u00C0-\u00FF ]{4,30}$/,
			password: /(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*]{8,}/,
		};
		vm.getPasswordStrength = getPasswordStrength;
		vm.isSignedIn = User.isAuthed && User.email;
		vm.onClickSignOut = onClickSignOut;
		vm.onClickUpdate = onClickUpdate;

		/**
		 * @name $onInit
		 * @memberof Components.AccountController
		 */
		function $onInit() {
			vm.account = {
				name: User.name || null,
				email: User.email || null,
				company: User.company || null,
			};
			vm.pageUrls = {
				addresses: Utils.getPageUrl('addresses'),
				login: Utils.getPageUrl('login', {
					redirect_to: $location.path(),
				}),
				register: Utils.getPageUrl('register'),
			};
		}

		/**
		 * @name getPasswordStrength
		 * @param {string} password Password
		 * @return {number} Value for usage in progress element.
		 * @memberof Components.AccountController
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

		this.onClickChangePassword = () => {
			this.isShowingPasswordFields = true;
			jQuery('#collapsePassword').collapse('show');
		};

		/**
		 * @name onClickSignOut
		 * @memberof Components.AccountController
		 */
		function onClickSignOut() {
			vm.isSigningOut = true;
			User.logout().then(function () {
				window.location.href = '/';
			});
		}

		/**
		 * @name onClickUpdate
		 * @memberof Components.AccountController
		 */
		function onClickUpdate() {
			vm.isUpdating = true;
			const userData = {
				name: vm.account.name,
				email: vm.account.email,
				company: vm.account.company,
				password: vm.account.password,
				password_confirmation: vm.account.passwordConfirmation,
			};

			User.updateInfo(userData)
				.then(function () {
					vm.isUpdating = false;
				})
				.catch((reject) => {
					console.error(reject);
				});
		}
	}
})();
