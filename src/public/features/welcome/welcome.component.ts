import template from './welcome.component.html';

export const WelcomeComponent: ng.IComponentOptions = {
	controller: class Controller {
		static $inject = ['User', 'Utils'];
		cartCount: number;
		cartUrl: string;
		hasPunchoutEnabled: boolean;
		isSignedIn: boolean;
		userName: string;

		constructor(
			private User: {
				redirectToLogin(): void;
				cart_count: number;
				punchoutOnly: boolean;
				isAuthed: any;
				email: any;
				name: string;
			},
			private Utils: {
				getPageUrl: (key: string) => string;
			}
		) {
			this.cartCount = User.cart_count;
			this.cartUrl = Utils.getPageUrl('cart');
			this.hasPunchoutEnabled = User.punchoutOnly;
			this.isSignedIn = User.isAuthed && User.email;
			this.userName = User.name;
		}

		$onInit = () => {
			if (!this.isSignedIn) {
				this.User.redirectToLogin();
			}
		};
	},
	template,
};
