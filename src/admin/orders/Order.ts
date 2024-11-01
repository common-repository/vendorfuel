export class Order {
	order_id?: number;
	customer: {
		name: string;
	};
	order_date: string;
	status: string;
	total_amt: number;
}
