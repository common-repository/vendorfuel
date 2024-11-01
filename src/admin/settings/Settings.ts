export interface Settings {
	api_url: string;
	api_key: string;
	product_slug: string;
	cat_slug: string;
	requireAddress: boolean;
	debug: boolean;
	redirectToCart: boolean;
	pagination: boolean;
	enableRecyclable: boolean;
	checkout: {
		attention_option: boolean;
		company_name_option: boolean;
		cost_center_option: boolean;
		issuing_office_option: boolean;
		notes_option: boolean;
		purchase_order_option: boolean;
	};
	showSubcategoryCards: boolean;
}
