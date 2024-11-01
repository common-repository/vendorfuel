export class CustomerLoginService {
	static $inject: string[] = ['$cookies', '$http', '$window'];

	private apiRoot = `${localized.apiURL}/admin/customers`;
	isPunchoutOnly: boolean;

	constructor(
		private $cookies: ng.cookies.ICookiesService,
		private $http: ng.IHttpService,
		private $window: ng.IWindowService
	) {}

	clearCookies() {
		const cookies: string[] = [
			'vf.user.name',
			'vf.user.email',
			'vf.user.group_admin',
			'vf.user.approver',
			'vf.user.is-guest',
			'vf.user.group',
			'vf.user.remember',
			'vf.user.last_login',
			'vf.user.cartCount',
			'vf.user.punchoutOnly',
			'vf.user.mixedPunchout',
			'vf.user.company',
			'vf.user.defaultShippingProfile',
			'vf.user.defaultBillingProfile',
			'vf.user.group_id',
			'vf.user.group_parent_id',
			'vf.user.price_availability',
			'vf.user.cost_center_is_required',
			'vf.user.currentGroup_id',
			'vf.cart',
			'vf.auth.token',
			'vf.cart.cartCount',
			'force_password',
		];

		cookies.forEach((cookie) => {
			this.$cookies.remove(cookie, {
				samesite: 'none',
				secure: true,
				path: '/',
			});
		});
	}

	login(id: number) {
		return this.$http
			.get(`${this.apiRoot}/${id}/login`)
			.then((response: any) => {
				if (!response.data.errors.length) {
					this.isPunchoutOnly = response.data.punchout_only;
					this.clearCookies();
					this.updateCookies(response.data);
				}
				return response.data;
			});
	}

	openNewTab() {
		const url = this.isPunchoutOnly ? '/welcome' : '/';
		this.$window.open(url, 'Logged In As Customer');
	}

	updateCookies(data: {
		approver?: boolean;
		cart_count: number;
		company?: string;
		cost_center_is_required?: boolean;
		default_billing_profile?: number;
		default_shipping_profile?: number;
		email: string;
		guest: boolean;
		group?: string;
		group_admin?: boolean;
		group_id?: number;
		group_parent_id?: number;
		mixed_punchout?: boolean;
		name: string;
		price_availability?: boolean;
		punchout_only: boolean;
		token: string;
	}) {
		const options = { samesite: 'none', secure: true, path: '/' };

		this.$cookies.put('vf.auth.token', data.token, options);
		this.$cookies.put('vf.user.name', data.name, options);
		this.$cookies.put('vf.user.email', data.email, options);
		this.$cookies.put('vf.user.is-guest', data.guest.toString(), options);

		if (data.group) {
			this.$cookies.put(
				'vf.user.group',
				JSON.stringify(data.group),
				options
			);
		}

		if (typeof data.group_admin !== 'undefined') {
			this.$cookies.put(
				'vf.user.group_admin',
				data.group_admin.toString(),
				options
			);
		}
		if (typeof data.approver !== 'undefined') {
			this.$cookies.put(
				'vf.user.approver',
				data.approver.toString(),
				options
			);
		}
		if (data.cart_count) {
			this.$cookies.put(
				'vf.user.cartCount',
				data.cart_count.toString(),
				options
			);
		}
		if (typeof data.punchout_only !== 'undefined') {
			this.$cookies.put(
				'vf.user.punchoutOnly',
				data.punchout_only.toString(),
				options
			);
		}
		if (data.company) {
			this.$cookies.put('vf.user.company', data.company, options);
		}

		if (data.default_billing_profile) {
			this.$cookies.put(
				'vf.user.defaultBillingProfile',
				data.default_billing_profile.toString(),
				options
			);
		}
		if (data.default_shipping_profile) {
			this.$cookies.put(
				'vf.user.defaultShippingProfile',
				data.default_shipping_profile.toString(),
				options
			);
		}

		if (data.group_id) {
			this.$cookies.put(
				'vf.user.group_id',
				data.group_id.toString(),
				options
			);
			this.$cookies.put(
				'vf.user.currentGroup_id',
				data.group_id.toString(),
				options
			);
		}
		if (data.group_parent_id) {
			this.$cookies.put(
				'vf.user.group_parent_id',
				data.group_parent_id.toString(),
				options
			);
		}
		if (typeof data.mixed_punchout !== 'undefined') {
			this.$cookies.put(
				'vf.user.mixedPunchout',
				data.mixed_punchout.toString(),
				options
			);
		}
		if (typeof data.price_availability !== 'undefined') {
			this.$cookies.put(
				'vf.user.price_availability',
				data.price_availability.toString(),
				options
			);
		}
		if (typeof data.cost_center_is_required !== 'undefined') {
			this.$cookies.put(
				'vf.user.cost_center_is_required',
				data.cost_center_is_required.toString(),
				options
			);
		}
	}
}
