export class Category {
	cat_id?: number;
	parent_id?: number;
	title: string;
	unspsc?: string;
	img_url?: string;
	products?: number[];
	avatax_tax_code?: string;
	slug?: string;
	description?: string;
	meta?: {
		title?: string;
		description?: string;
	};

	constructor() {
		this.title = '';
		this.products = [];
	}
}
