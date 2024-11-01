export interface IRole {
	'lock_billing': boolean;
	'lock_shipping': boolean;
	id: number;
	'store_id': number;
	name: string;
	'price_sheet_id': number|string;
	'group_id': number|string;
	registration: boolean;
	'price_availability': boolean;
	'order_prefix': string;
	terms: string;
	'punchout_only': boolean;
	'credit_line': boolean;
	'allow_payment': boolean;
	'mixed_punchout': boolean;
	'customer_class': string;
	taxable: boolean;
	'allowed_email_domains': null;
	documents: any[];
	group: null;
}
