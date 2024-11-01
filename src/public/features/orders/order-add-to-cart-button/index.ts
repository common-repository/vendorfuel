import template from './template.html';

interface Product {
	product_id: number;
	qty: number;
	price: number;
}

export const OrderAddToCartButton: ng.IComponentOptions = {
	bindings: {
		product: '<',
	},
	controller: class Controller {
		static $inject: string[] = ['$http'];

		product: Product;
		isBusy: boolean;
		id: number;
		priceAvailability: {
			availableQty: number;
			currentPrice: number;
		};
		uuid: string = crypto.randomUUID();
		warning: string;
		error: string;
		notification: string;

		// eslint-disable-next-line no-useless-constructor
		constructor(private $http: ng.IHttpService) {}

		$onInit() {
			this.id = this.product?.product_id;
		}

		handleClick() {
			this.isBusy = true;
			const url = `${localized.apiURL.replace(
				'v1',
				'v2'
			)}/catalog/products/${this.id}/price-availability`;

			this.$http
				.get(url)
				.then((response) => response.data)
				.then(
					(responseData: {
						errors: string[];
						priceAvailability: {
							availableQty: number;
							currentPrice: number;
						};
						warnings: string[];
					}) => {
						if (responseData.errors.length) {
							this.error = responseData.errors[0];
						}
						if (responseData.warnings.length) {
							this.warning = responseData.warnings[0];
						}
						this.priceAvailability = responseData.priceAvailability;
					}
				)
				.catch(() => {
					// If there's an API error for price availability, silently fail, but proceed to add to cart anyway.
					this.handleAddToCart();
				})
				.finally(() => {
					this.isBusy = false;
				});
		}

		handleAddToCart() {
			const url = `${localized.apiURL}/cart/add`;
			const data = {
				product_id: this.id,
				qty: 1,
			};

			this.isBusy = true;

			this.$http
				.post(url, data)
				.then(() => {
					this.notification =
						'Added item to your cart at current price.';
				})
				.catch(() => {
					this.error =
						'An error occured while attempting to add this item to your cart. Please contact customer service for further assistance.';
				})
				.finally(() => (this.isBusy = false));
		}
	},
	template,
};
