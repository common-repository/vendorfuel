export class Banner {
	banner_id?: number;
	area_id: number;
	content: string;
	description: string;
	price_sheet_id?: number;
	group_id?: number;

	constructor() {
		this.content = '';
		this.description = '';
	}
}
