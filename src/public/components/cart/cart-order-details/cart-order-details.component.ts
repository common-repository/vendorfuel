import template from './cart-order-details.html';

export const CartOrderDetailsComponent: ng.IComponentOptions = {
	template,
	require: {
		cartController: '^vfCart',
	},
	bindings: {
		subtotal: '=',
		totalAmount: '=',
		cartCount: '=',
		promoDiscount: '=',
		cart: '=',
	},
	controller: class CartOrderDetailsController {
		static $inject: string[] = [
			'$location',
			'Cart',
			'User',
			'Utils',
		];

		cartController: any;
		isAuthed: boolean;
		isCartSaved: boolean;
		isGuest: boolean;
		isSavingCart: boolean;
		isSignedIn: boolean;
		pageUrls: {
			checkout: string;
			login: string;
			register: string;
			savedCarts: string;
		};
		promptClearCart: boolean;
		promptSaveCart: boolean;
		savedCarts: any;

		constructor(
			private $location: ng.ILocationService,
			private Cart: any,
			private User: any,
			private Utils: any,
		) {
			this.isAuthed = this.User.isAuthed;
			this.isSignedIn = this.User.isAuthed && this.User.email;
			this.isGuest = this.User.isGuest;
			this.pageUrls = {
				checkout: this.Utils.getPageUrl( 'checkout' ),
				login: this.Utils.getPageUrl( 'login', { redirect_to: this.$location.path() } ),
				register: this.Utils.getPageUrl( 'register' ),
				savedCarts: this.Utils.getPageUrl( 'saved-carts' ),
			};
		}

		$onInit() {
			this.getSavedCarts();
		}

		appendToSavedCart( title: string, e?: Event ) {
			if ( e ) {
				e.preventDefault();
			}
			this.saveCart( title );
		}

		clearCart() {
			this.cartController.clear();
			this.promptClearCart = false;
		}

		getSavedCarts() {
			this.Cart.getSavedList()
				.then( ( response ) => {
					this.savedCarts = response;
				} );
		}

		saveCart( title: string ) {
			this.isCartSaved = false;
			this.isSavingCart = true;
			this.Cart.save( title )
				.then( () => {
					this.getSavedCarts();
					this.isSavingCart = false;
					this.isCartSaved = true;
				} );
		}
	},
};
