export class Rate {
	id?: number;
	name: string;
	description: string;
	amount: number;
	enabled: boolean;
	label: string;
	freeIfTotal: boolean;
	isPercentage: boolean;
	freeOrderTotal: number;
	customers: unknown[];
	groups: unknown[];
	modifiers: unknown[];
	price_sheets: unknown[];

	constructor() {
		this.name = '';
		this.description = '';
		this.label = '';
		this.amount = 0;
		this.freeIfTotal = false;
		this.freeOrderTotal = 0;
		this.enabled = false;
		this.isPercentage = false;
		this.customers = [];
		this.groups = [];
		this.modifiers = [];
		this.price_sheets = [];
	}
}
