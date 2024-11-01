export class PromoCode {
	code: string;
	customer_id?: number;
	auto_add?: boolean;
	require_all_items?: boolean;
	email?: string;
	date_effective?: Date;
	date_expires?: Date;
	limit_per_customer?: number;
	limit_total?: number;
	discount?: number;
	max_discount?: number;
	min_purchase?: number;
	discount_type?: 'percentage' | 'discount';
	order_prefix?: string;
	products?: {
		product_id: number;
		deleted?: boolean;
	};
	restricted_products?: {
		product_id: number;
		deleted?: boolean;
	};

	constructor() {
		this.code = '';
	}
}
