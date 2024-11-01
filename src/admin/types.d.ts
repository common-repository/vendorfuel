export interface Batch {
	id: number;
	filename: string;
	status:
		| 'pending'
		| 'confirmed'
		| 'processing'
		| 'processed'
		| 'completed'
		| 'uploaded';
	total_records: number;
	processed_records?: number;
	uploaded_at: string;
	started_at: string;
	finished_at: string;
	failures: {
		data: BatchFailure[];
	};
}
export interface BatchFailure {
	id: number;
	customer_batch_id: number;
	row: number;
	failures: string[];
	value: {
		[name: string]: string;
	};
}

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
		PluginURL: string;
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

export interface Option {
	value: string;
	label: string;
}

export interface Paginator {
	data: unknown[];
	current_page: number;
	from: number;
	last_page: number;
	per_page: number;
	to: number;
	total: number;
}

export interface Params {
	direction?: 'asc' | 'desc';
	filters?: {
		field: string;
		term: string;
	}[];
	orderBy?: string;
	page?: number;
	perPage?: number;
	q?: string;
	searchBy?: string;
}

export interface SelectControlOption extends Option {
	disabled?: boolean;
}
