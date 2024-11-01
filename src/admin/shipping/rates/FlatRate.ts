export interface FlatRate {
	name: string;
	amount: number;
	enabled: boolean;
	free_if_total: boolean;
	free_order_total: number;
	label: string;
}
