export interface FlatRate {
	id: number;
	name: string;
	amount: number;
	enabled: boolean;
	free_if_total: boolean;
	free_order_total: number;
	label: string;
}
