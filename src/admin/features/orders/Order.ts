export class Order {
	billing_profile: string;
	customer: {
		name: string;
	};
	group: {
		group_id: number;
		name: string;
	} | null;
	group_id?: number | null;
	lineItems?: { costs: unknown[]; purchase_order: unknown }[];
	order_id?: number;
	order_date: string;
	order_notifications?: { response: unknown; body: unknown }[];
	shipping_profile: string;
	status: string;
	total_amt: number;
}
