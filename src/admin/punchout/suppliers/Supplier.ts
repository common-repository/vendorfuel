export class Supplier {
	name: string;
	logo?: string;
	endpoint_base: string;
	domain_type: 'DUNS' | 'NetworkID';
	domain_identity: string;
	punchout_identity: string;
	punchout_secret: string;
	update_endpoint_daily?: boolean;
	prefix?: string;
	domain_secret: string;

	constructor() {
		this.name = '';
		this.domain_type = 'DUNS';
	}
}
