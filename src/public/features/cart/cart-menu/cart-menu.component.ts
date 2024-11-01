import template from './cart-menu.component.html';

interface ShippingMethod {
	freeIfTotal: boolean;
	freeOrderTotal: number;
}

export const CartMenu: ng.IComponentOptions = {
	bindings: {
		btnClass: '@?',
	},
	template,
	controller: class Controller {
		static $inject: string[] = ['Cart', 'User', 'Utils'];

		public cartUrl: string;
		public productSlug: string;
		public isInProgress: boolean;
		public cartItems: {
			description: string;
			price: number;
			slug: string;
			uom: string;
		}[];
		private cartCount: number;
		public totalAmount: number;
		minOrderAmount: number;
		showFreeShipping: boolean = localized.settings.general.showFreeShipping;
		btnClass: string;

		constructor(private Cart: any, private User: any, private Utils: any) {
			this.cartUrl = this.Utils.getPageUrl('cart');
			this.productSlug = localized.settings.general.product_slug;
		}

		$onInit() {
			this.btnClass = this.btnClass || 'btn-light';
		}

		$doCheck() {
			if (this.User.isAuthed) {
				if (this.cartCount !== this.Cart.cartCount) {
					this.cartCount = this.Cart.cartCount;
					this.getCartDetails();
				}
			} else {
				this.cartCount = 0;
			}
		}

		getCartDetails() {
			this.isInProgress = true;
			this.Cart.fillDetails()
				.then((response) => response.data)
				.then((data) => {
					if (data.cart) {
						this.cartItems = this.getCartItems(data.cart.items);
						this.totalAmount = Number(data.cart.total_amount);
					} else {
						this.cartItems = [];
						this.totalAmount = 0;
					}
					this.setMinOrderAmount(data.shipping_methods);
				})
				.finally(() => {
					this.isInProgress = false;
				});
		}

		getCartItems(
			items
		): { description: string; price: number; slug: string; uom: string }[] {
			return Object.values(items);
		}

		setMinOrderAmount(shippingMethods: ShippingMethod[]): number {
			if (shippingMethods?.length) {
				const filteredMethods = shippingMethods.filter(
					(method: ShippingMethod) => method.freeIfTotal
				);

				if (filteredMethods.length) {
					return (this.minOrderAmount = Math.min(
						...filteredMethods.map(
							(method: ShippingMethod) => method.freeOrderTotal
						)
					));
				}
			}
		}
	},
};
