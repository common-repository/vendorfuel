import template from './product-metadata.component.html';
import { composeAvailability } from './compose-availability';

interface Product {
	available_qty: number;
	brand_name: string;
	description: string;
	long_description: string;
	mfg_part_num: string;
	price: number;
	sku: string;
	status: string;
}

export const ProductMetadata: ng.IComponentOptions = {
	bindings: {
		product: '<',
	},
	template,
	controller: class Controller {
		public product: Product;
		public productUrl = document.URL;
		public availability: string;

		$onInit() {
			this.availability = composeAvailability(
				this.product.status,
				this.product.available_qty
			);
		}
	},
};
