import type { Product } from '../products/Product';

export class Collection {
	name: string;
	description?: string;
	image?: string | null;
	products: Product[] | number[];
	categories:
		| {
				value: {
					cat_id: number;
				};
		  }[]
		| number[];

	constructor() {
		this.name = '';
		this.description = '';
		this.products = [];
		this.categories = [];
	}
}
