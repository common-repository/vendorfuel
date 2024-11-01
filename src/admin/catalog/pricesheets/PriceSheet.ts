export class PriceSheet {
	price_sheet_id?: number;
	sheet?: string;
	site_id?: string;
	cost_sheet_id?: number;
	gp_price_sheet?: string;
	default_price_sheet?: boolean;
	products?: number[];
	shipping_flat_rates?: number[];
}
