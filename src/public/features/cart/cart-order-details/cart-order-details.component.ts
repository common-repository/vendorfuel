import template from './cart-order-details.component.html';

export const CartOrderDetailsComponent: ng.IComponentOptions = {
	template,
	require: {
		cartController: '^cartComponent',
	},
	bindings: {
		subtotal: '=',
		totalAmount: '=',
		cartCount: '=',
		promoDiscount: '=',
		cart: '=',
	},
	controller: class CartOrderDetailsController {
		static $inject: string[] = ['$location', 'Cart', 'User', 'Utils'];

		cartController: any;
		hasSavedCart: boolean;
		isAuthed: boolean;
		isBusy: boolean;
		isGuest: boolean;
		isClearCartFormVisible: boolean;
		isSaveCartFormVisible: boolean = false;
		isSignedIn: boolean;
		pageUrls: {
			checkout: string;
			login: string;
			register: string;
			savedCarts: string;
		};
		savedCarts: any;

		constructor(
			private $location: ng.ILocationService,
			private Cart: any,
			private User: any,
			private Utils: any
		) {
			this.isAuthed = this.User.isAuthed;
			this.isSignedIn = this.User.isAuthed && this.User.email;
			this.isGuest = this.User.isGuest;
			this.pageUrls = {
				checkout: this.Utils.getPageUrl('checkout'),
				login: this.Utils.getPageUrl('login', {
					redirect_to: this.$location.path(),
				}),
				register: this.Utils.getPageUrl('register'),
				savedCarts: this.Utils.getPageUrl('saved-carts'),
			};
		}

		$onInit() {
			this.getSavedCarts();
		}

		updateSavedCart(title: string) {
			this.saveCart(title);
		}

		clearCart() {
			this.cartController.clear();
			this.isClearCartFormVisible = false;
		}

		getSavedCarts() {
			this.Cart.getSavedList().then((response) => {
				this.savedCarts = response;
			});
		}

		handleToggleClearCartForm(): void {
			this.isClearCartFormVisible = !this.isClearCartFormVisible;
		}

		handleToggleSaveCartForm(): void {
			this.hasSavedCart = false;
			this.isSaveCartFormVisible = !this.isSaveCartFormVisible;
		}

		saveCart(title: string) {
			this.isBusy = true;
			this.Cart.save(title).then(() => {
				this.getSavedCarts();
				this.hasSavedCart = true;
				this.isBusy = false;
			});
		}
	},
};
