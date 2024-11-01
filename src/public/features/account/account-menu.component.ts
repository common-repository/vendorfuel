import template from './account-menu.component.html';

export const AccountMenu: ng.IComponentOptions = {
	template,
	bindings: {
		btnClass: '@?',
	},
	controller: class AccountMenuController {
		static $inject = ['User', 'Utils'];
		alert: string;
		customer: {
			email?: string;
			password?: string;
			errors?: string[];
		};
		isSigningIn: boolean;
		isSigningOut: boolean;
		isShowingPassword: boolean;
		url: {
			addresses: string;
			account: string;
			savedCarts: string;
			favorites: string;
			forgotPassword: string;
			groupAccount: string;
			groupOrders: string;
			orders: string;
			register: string;
			welcome: string;
		};
		isAdmin: boolean;
		isApprover: boolean;
		isPunchoutOnly: boolean;
		isMixedPunchout: boolean;
		isSignedIn: boolean;
		firstName: string;
		userName: string;
		showPassword: boolean;
		btnClass: string;

		constructor(private User: any, private Utils: any) {
			this.alert = '';
			this.customer = {};
			this.isSigningIn = false;
			this.isSigningOut = false;
			this.isShowingPassword = false;
			this.url = {
				addresses: Utils.getPageUrl('addresses'),
				account: Utils.getPageUrl('account'),
				savedCarts: Utils.getPageUrl('saved-carts'),
				favorites: Utils.getPageUrl('favorites'),
				forgotPassword: Utils.getPageUrl('forgot-password'),
				groupAccount: Utils.getPageUrl('group-account'),
				groupOrders: Utils.getPageUrl('group-orders'),
				orders: Utils.getPageUrl('orders'),
				register: Utils.getPageUrl('register'),
				welcome: '/welcome',
			};
		}

		$onInit() {
			this.getUserData();
			this.btnClass = this.btnClass || 'btn-light';
		}

		getFirstName(name: string): string {
			const space = ' ';
			if (name.includes(space)) {
				return name.substr(0, name.indexOf(space));
			}
			return name;
		}

		getUserData() {
			this.isAdmin = this.User.group_admin;
			this.isApprover = this.User.approver;
			this.isPunchoutOnly = this.User.punchoutOnly;
			this.isMixedPunchout = this.User.mixedPunchout;
			this.isSignedIn = this.User.isAuthed && this.User.email;
			this.firstName = this.User.name
				? this.getFirstName(this.User.name)
				: null;
			this.userName = this.User.name || null;
			this.setBodyClasses();
		}

		login() {
			if (this.customer.email && this.customer.password) {
				this.isSigningIn = true;
				const userData = this.customer;

				this.User.login(userData)
					.then((response) => response.data)
					.then((data) => {
						if (data.errors.length) {
							this.alert = data.errors.join('. ');
						} else {
							this.getUserData();
							this.checkPunchout();
						}
						this.isSigningIn = false;
					})
					.catch((error) => {
						this.customer.errors = error.data.errors;
						if (error.data.errors.length > 0) {
							this.alert = this.customer.errors.join('. ');
						}
						this.isSigningIn = false;
					});
			} else {
				this.isSigningIn = false;
				this.alert =
					'Your username or password is blank. Please fill out both fields.';
			}
		}

		checkPunchout() {
			if (this.User.punchoutOnly) {
				this.Utils.goToPage(this.Utils.getPageUrl('welcome'));
			}
		}

		logout() {
			this.isSigningOut = true;
			this.User.logout().then(() => {
				window.location.href = '/';
			});
		}

		setBodyClasses() {
			const classes: string[] = [];
			if (this.isSignedIn) {
				classes.push('vf-signed-in');
			}
			if (this.isAdmin) {
				classes.push('vf-group-admin');
			}
			if (this.isPunchoutOnly) {
				classes.push('is-punchout');
			}
			if (this.isMixedPunchout) {
				classes.push('is-mixed-punchout');
			}
			document.body.classList.add(...classes);
		}

		toggleShowPassword() {
			this.showPassword = !this.showPassword;
		}
	},
};
