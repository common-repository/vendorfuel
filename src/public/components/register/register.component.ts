import angular from 'angular';
import template from './register.component.html';

(function () {
	'use strict';

	angular.module('vfApp').component('vfRegistrationForm', {
		bindings: {
			customerRole: '<?',
		},
		template,
		controller: RegistrationController,
	});

	RegistrationController.$inject = [
		'$location',
		'$scope',
		'Alerts',
		'User',
		'Utils',
	];

	function RegistrationController(
		$location: ng.ILocationService,
		$scope: ng.IScope,
		Alerts,
		User,
		Utils
	) {
		this.hasAPIKey = localized.settings.general.api_key;
		const vm = this;
		vm.alertsList = Alerts.list;
		vm.documents = [];
		vm.confirmPasswordStrength = 0;
		this.form = {};
		vm.formPatterns = {
			name: /^[a-zA-Z\u00C0-\u00FF ]{4,30}$/,
			email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
			password: /(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*]{8,}/,
		};
		vm.hasForcedRole = localized.settings.store.options['Force Role'];
		vm.isAccountCreated = false;
		vm.isEmailConfirmed = false;
		vm.isPasswordConfirmed = false;
		vm.isSignedIn = User.isAuthed && !User.isGuest;
		vm.passwordStrength = 0;
		vm.pageUrls = {
			account: Utils.getPageUrl('account'),
			catalog: Utils.getPageUrl('catalog'),
			home: Utils.getPageUrl('home'),
		};
		vm.referrer = Utils.urlParser.param('referrer');

		this.$onInit = () => {
			this.checkVerification($location.search());
			if (!vm.isSignedIn && this.hasAPIKey) {
				vm.isLoading = true;
				if (this.customerRole) {
					this.getRole(this.customerRole);
				} else {
					this.getRoles();
				}
			}
		};

		/**
		 * @param {Object} el Input file element.
		 */
		this.attachFile = (el) => {
			const docId = Number(el.id.replace('doc-', ''));
			const file = el.files[0];
			$scope.$apply(() => {
				vm.documents[docId] = file;
				this.form.documents.forEach((doc, index) => {
					if (doc.id === docId) {
						this.form.documents[index].fileDetails = {
							name: file.name,
							size: Math.round(file.size / 1000),
							type: file.type,
						};
					}
				});
			});
		};

		this.checkVerification = (search: { auth?: string; code?: string }) => {
			this.isVerifying = 'auth' in search && 'code' in search;
			this.pageTitle = this.isVerifying
				? 'Account Verification'
				: 'Register';
			if (this.isVerifying) {
				User.verifyEmail(search.auth, search.code).then((response) => {
					if (!response.data.errors.length) {
						this.isVerified = true;
					} else {
						this.isNotVerified = true;
					}
				});
			}
		};

		this.getRole = (id: number) => {
			User.role(id)
				.then((response) => response.data)
				.then((roleData) => {
					this.form.role = roleData.role;
					this.form.documents = roleData.role.documents;
					vm.documents = [];
					vm.isLoading = false;
				});
		};

		this.getRoles = () => {
			User.roles()
				.then((response) => response.data)
				.then((data) => {
					vm.roles = data.roles;
					vm.isLoading = false;
				});
		};

		this.onChangeRole = () => {
			const newRole = vm.roles.find(
				(role) => role.id === this.form.role.id
			);
			this.form.documents = newRole ? newRole.documents : [];
			vm.documents = [];
		};

		this.onSubmit = () => {
			this.isSubmitting = true;
			const formData = new FormData();
			Object.entries(this.form).forEach((field) => {
				const [key, value] = field;
				if (value && key !== 'documents' && key !== 'role') {
					formData.append(key, value);
				}
			});

			if (this.form.role) {
				formData.set('role', this.form.role.id);
			}

			vm.documents.forEach((value, key) => {
				formData.append('documents[' + key + ']', value);
			});

			// Add verification return url field
			formData.append(
				'verification_return_url',
				Utils.getPageUrl('register')
			);

			User.register(formData)
				.then((response) => response.data)
				.then((data) => {
					if (data.errors.length === 0) {
						vm.isAccountCreated = true;
					}
					this.isSubmitting = false;
				})
				.catch((error) => {
					console.error('Error: ', error);
				});
		};

		/**
		 * @param {Object} email1 Email address.
		 * @param {Object} email2 Confirmation email address.
		 */
		this.confirmEmails = (email1, email2) => {
			vm.isEmailConfirmed =
				email1.$viewValue.toLowerCase() ===
				email2.$viewValue.toLowerCase()
					? true
					: false;
		};

		/**
		 * @param {string} password1 Password.
		 * @param {string} password2 Confirmation password.
		 */
		this.confirmPasswords = (password1, password2) => {
			vm.isPasswordConfirmed = password1 === password2 ? true : false;
		};

		/**
		 * @param {string} password Password.
		 * @return {number} Password strength.
		 */
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

		this.onClickResend = () => {
			this.isVerifying = true;
			this.isNotVerified = true;
		};

		/**
		 * @name onClickSignOut
		 * @param {Object} event Click event.
		 */
		this.onClickSignOut = (event) => {
			event.preventDefault();
			vm.isSigningOut = true;
			User.logout().then(() => {
				window.location.href = '/';
			});
		};

		this.submitVerificationForm = (email: string) => {
			this.isSubmitting = true;
			const returnUrl = Utils.getPageUrl('register');
			User.resendVerificationEmail(email, returnUrl).then(() => {
				this.isSubmitting = false;
				this.isSubmitted = true;
			});
		};
	}
})();
