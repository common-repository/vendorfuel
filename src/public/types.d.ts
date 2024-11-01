export interface Localized {
	apiURL: string;
	dir: {
		content: string;
		root: string;
		url: string;
		wpRestUrl: string;
	};
	pages: {
		[key: string]: {
			id: number;
			url: string;
			title: string;
			template: string;
		};
	};
	settings: {
		analytics: {};
		authnet_id: string;
		authnet_public_key: string;
		gateway: boolean;
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
			showFreeShipping: boolean;
		};
		square_location_id: string;
		store: {
			default_customer_prefix: string | null;
			default_order_prefix: string | null;
			name: string;
			options: { [key: string]: boolean };
			url: string;
		};
		stripe_enabled: boolean;
		stripe_pk: string;
	};
}
