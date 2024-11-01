import template from './price-availability.html';

export const PriceAvailabilityComponent: ng.IComponentOptions = {
	bindings: {
		priceAvailability: '<',
		onComplete: '&',
		order: '<',
	},
	template,
	controller: class PriceAvailabilityController {
		private onComplete: any;
		private priceAvailability: any;
		isLoading: boolean;
		response: any;
		order: any;
		products: any;

		$onInit() {
			this.response = this.createResponse(this.priceAvailability);
			this.products = this.getProducts(this.order.items);
		}

		complete() {
			this.isLoading = true;
			this.onComplete({ data: this.response });
		}

		createResponse(data: { [s: string]: unknown } | ArrayLike<unknown>) {
			return Object.fromEntries(
				Object.entries(data).map((products) => {
					const [, codes] = products;
					products[1] = Object.fromEntries(
						Object.entries(codes).map((code) => {
							const [key, changes] = code;
							const defaultActions = {
								PA001: 'accepted',
								PA002: 'changed',
								PA003: 'removed',
							};
							code[1] = {
								original:
									changes.requestedQuantity ||
									changes.originalPrice,
								returned:
									changes.requestedQuantity ||
									changes.newPrice ||
									0,
								action: defaultActions[key],
							};
							return code;
						})
					);
					return products;
				})
			);
		}

		getProducts(items: any[]) {
			const products = {};
			Object.values(items).forEach((item: any) => {
				products[item.sku] = {
					name: item.description,
				};
			});
			return products;
		}
	},
};
