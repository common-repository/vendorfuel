import template from './order-by-sku.component.html';

export const OrderBySkuComponent: ng.IComponentOptions = {
	template,
	controller: class OrderBySkuController {
		static $inject: string[] = ['Cart', 'Products', 'User'];
		public isSignedIn: boolean;
		public qty = 1;
		public products: {
			imageUrl: string;
			name: string;
			price: number;
			sku: string;
			uom: string;
			url: string;
		}[];
		public isInProgress: boolean;

		constructor(
			private Cart: any,
			private Products: any,
			private User: { isAuthed: boolean; email?: string }
		) {
			this.isSignedIn = User.isAuthed && User.email ? true : false;
		}

		$onInit() {
			if (this.isSignedIn) {
				this.getSkuList();
			}
		}

		getSkuList() {
			const params = {
				q: '',
			};

			this.Products.list(params)
				.then((resolve) => {
					this.products = resolve.data.product_briefs;
				})
				.catch((reject) => {
					console.error(reject);
				});
		}

		submit(sku: string, qty: number) {
			this.isInProgress = true;
			this.Cart.addBySku(sku, qty)
				.then(() => {
					this.isInProgress = false;
				})
				.catch((reject) => {
					console.error(reject);
				});
		}
	},
};
