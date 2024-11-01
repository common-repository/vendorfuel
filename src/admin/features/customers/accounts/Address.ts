export class Address {
	type: 'billing' | 'shipping';
	first_name?: string;
	last_name?: string;
	name?: string;
	email?: string;
	address1: string;
	address2?: string;
	city: string;
	state: string;
	zip: string;
	phone?: string;
	phone_extension?: string;

	constructor() {
		this.address1 = '';
		this.city = '';
		this.state = '';
		this.zip = '';
	}
}
