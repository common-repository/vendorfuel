import template from './template.html';

interface ICart {
	saved_cart_id: number;
	cart_title: string;
	num_items: number;
}

export const SavedCarts: ng.IComponentOptions = {
	template,
	controller: class Controller {
		static $inject = ['$cookies', '$http'];

		carts: ICart[];
		isLoading: boolean;
		isSignedIn: boolean;
		pageUrls = {
			login: composeLoginUrl(),
			register: localized.pages.register.url,
			savedCart: localized.pages['saved-cart'].url,
		};

		constructor(
			private $cookies: ng.cookies.ICookiesService,
			private $http: ng.IHttpService
		) {
			this.isSignedIn =
				this.$cookies.get('vf.auth.token') &&
				this.$cookies.get('vf.user.name')
					? true
					: false;
		}

		$onInit() {
			if (this.isSignedIn) {
				this.getSavedCarts();
			}
		}

		getSavedCarts() {
			this.isLoading = true;

			const url = `${localized.apiURL}/cart/saved/list`;
			this.$http
				.get(url)
				.then((response) => response.data)
				.then(
					(responseData: {
						saved_carts: { [key: number]: ICart };
					}) => {
						if (responseData.saved_carts) {
							this.carts = Object.values(
								responseData.saved_carts
							);
							this.isLoading = false;
						}
					}
				);
		}
	},
};

function composeLoginUrl(): string {
	const url = new URL(localized.pages.login.url);
	url.searchParams.append('redirect_to', location.pathname);
	return url.href;
}
