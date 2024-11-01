export class Review {
	'parent_review_id': null | number;
	'customer_id': number;
	'product_id': number;
	status: 'approved' | 'pending';
	rating: number;
	helpfulness: number;
	'display_name': string;
	email: string;
	title: string;
	content: string;
	'created_at': string;
	'updated_at': string;
	'deleted_at': null | string;
}
