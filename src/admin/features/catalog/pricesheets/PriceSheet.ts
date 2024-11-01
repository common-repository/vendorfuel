export class Pricesheet {
	id?: number;
	sheet: string;
	site_id?: string;
	cost_sheet_id?: number;
	gp_price_sheet?: string;
	default_price_sheet?: boolean;
	products?: unknown[];
	shipping_rates?: unknown[];
	transaction_type?: 'Book' | 'Sale' | null;
	clearSaleDisabled?: boolean;
}
