import type { Document } from '../../shared/Document';
import type { Image } from '../../shared/Image';

export class Product {
	brand_name?: string;
	description?: string;
	documents: Document[];
	green?: boolean;
	green_attributes?: number;
	ignore_inventory: boolean;
	image?: {
		orig_url: string;
	};
	images?: Image[];
	keywords?: string;
	long_description?: string;
	manufacturer?: {
		id: number;
		name: string;
	};
	manufacturer_id?: number;
	meta?: unknown;
	mfg_part_num?: string;
	parcels?: unknown[];
	pricesheets?: {
		price: number;
	}[];
	product_id?: number;
	sku?: string;
	slug?: string;
	status?: 'active' | string;

	constructor() {
		this.description = '';
		this.status = 'active';
		this.images = [];
		this.pricesheets = [];
		this.parcels = [];
		this.meta = {};
		this.documents = [];
		this.keywords = '';
	}
}
