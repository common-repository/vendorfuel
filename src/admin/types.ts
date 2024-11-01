export interface Localized {
	apiURL: string;
	dir: {
		content: string;
		root: string;
		templates: string;
		url: string;
		wpRestUrl: string;
	};
	nonce: string;
	plugin_data: {
		Author: string;
		AuthorName: string;
		AuthorURI: string;
		Description: string;
		DomainPath: string;
		Name: string;
		Network: boolean;
		PluginURI: string;
		RequiresPHP: string;
		RequiresWP: string;
		TextDomain: string;
		Title: string;
		UpdateURI: string;
		Version: string;
	};
	settings: {
		conversion: false;
		general: {
			api_key: string;
			api_url: string;
			cat_slug: string;
			checkout: {
				attention_option: boolean;
				company_option: boolean;
				cost_center_option: boolean;
				issuing_office_option: boolean;
				notes_option: boolean;
				purchase_order_option: boolean;
			};
			debug: boolean;
			disableFacets: boolean;
			enableAbilityOne: boolean;
			enableCoreList: boolean;
			enableGSA: boolean;
			enableRecyclable: boolean;
			pagination: boolean;
			product_slug: string;
			requireAddress: boolean;
			showRating: boolean;
		};
		image: unknown;
		store: {
			default_customer_prefix: string | null;
			default_order_prefix: string | null;
			name: string;
			options: { [key: string]: boolean };
			url: string;
		};
	};
}

export interface Paginator {
	data: any[];
	current_page: number;
	from: number;
	last_page: number;
	per_page: number;
	to: number;
	total: number;
}
