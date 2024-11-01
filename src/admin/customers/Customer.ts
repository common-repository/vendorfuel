export class Customer {
	pricesheet: {};
	promo_engine = true;
	group: any;
	status: 'active' | 'inactive' | 'verified' = 'active';
	shipping_flat_rates: never[];
	punchout_suppliers: never[];
	password?: string;
	password_confirmation?: string;
	f1_name?: string;
	f1_replace_field?: string;
	f1_required?: boolean;
	f1_value?: Array<string>;
	f2_name?: string;
	f2_replace_field?: string;
	f2_required?: boolean;
	f2_value?: Array<string>;
	f3_name?: string;
	f3_required?: boolean;
	f3_value?: Array<string>;
	f4_name?: string;
	f4_required?: boolean;
	f4_value?: Array<string>;
	f5_name?: string;
	f5_required?: boolean;
	f5_value?: Array<string>;
	f6_name?: string;
	f6_required?: boolean;
	f6_value?: Array<string>;

	constructor() {
		this.pricesheet = {};
		this.punchout_suppliers = [];
		this.shipping_flat_rates = [];
	}
}
