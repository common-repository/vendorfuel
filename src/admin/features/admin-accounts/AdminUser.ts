export class AdminUser {
	id?: number;
	name?: string;
	email?: string;
	password?: string | null;
	password_confirmation?: string | null;
	receive_quotes?: boolean;
	roles?:
		| Array<
				| 'billing'
				| 'developer'
				| 'manager'
				| 'customer-service'
				| 'catalog'
		  >
		| Set<
				| 'billing'
				| 'developer'
				| 'manager'
				| 'customer-service'
				| 'catalog'
		  >;

	constructor() {
		this.name = '';
		this.email = '';
		this.password = null;
		this.password_confirmation = null;
		this.receive_quotes = false;
		this.roles = new Set();
	}
}
