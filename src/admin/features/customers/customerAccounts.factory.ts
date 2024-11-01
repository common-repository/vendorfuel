customerAccountsFactory.$inject = [
	'$cookies',
];

/**
 * @param {Object} $cookies Angular service
 * @return {Object} Service
 */
export function customerAccountsFactory(
	$cookies: ng.cookies.ICookiesService,
) {
	//Select State DATA
	const states = [
		{ name: 'Alabama', val: 'AL' },
		{ name: 'Alaska', val: 'AK' },
		{ name: 'Arizona', val: 'AZ' },
		{ name: 'Arkansas', val: 'AR' },
		{ name: 'California', val: 'CA' },
		{ name: 'Colorado', val: 'CO' },
		{ name: 'Connecticut', val: 'CT' },
		{ name: 'Delaware', val: 'DE' },
		{ name: 'Florida', val: 'FL' },
		{ name: 'Georgia', val: 'GA' },
		{ name: 'Hawaii', val: 'HI' },
		{ name: 'Idaho', val: 'ID' },
		{ name: 'Illinois', val: 'IL' },
		{ name: 'Indiana', val: 'IN' },
		{ name: 'Iowa', val: 'IA' },
		{ name: 'Kansas', val: 'KS' },
		{ name: 'Kentucky', val: 'KY' },
		{ name: 'Louisiana', val: 'LA' },
		{ name: 'Maine', val: 'ME' },
		{ name: 'Maryland', val: 'MD' },
		{ name: 'Massachusetts', val: 'MA' },
		{ name: 'Michigan', val: 'MI' },
		{ name: 'Minnesota', val: 'MN' },
		{ name: 'Mississippi', val: 'MS' },
		{ name: 'Missouri', val: 'MO' },
		{ name: 'Montana', val: 'MT' },
		{ name: 'Nebraska', val: 'NE' },
		{ name: 'Nevada', val: 'NV' },
		{ name: 'New Hampshire', val: 'NH' },
		{ name: 'New Jersey', val: 'NJ' },
		{ name: 'New Mexico', val: 'NM' },
		{ name: 'New York', val: 'NY' },
		{ name: 'North Carolina', val: 'NC' },
		{ name: 'North Dakota', val: 'ND' },
		{ name: 'Ohio', val: 'OH' },
		{ name: 'Oklahoma', val: 'OK' },
		{ name: 'Oregon', val: 'OR' },
		{ name: 'Pennsylvania', val: 'PA' },
		{ name: 'Rhode Island', val: 'RI' },
		{ name: 'South Carolina', val: 'SC' },
		{ name: 'South Dakota', val: 'SD' },
		{ name: 'Tennessee', val: 'TN' },
		{ name: 'Texas', val: 'TX' },
		{ name: 'Utah', val: 'UT' },
		{ name: 'Vermont', val: 'VT' },
		{ name: 'Virgin Islands', val: 'VI' },
		{ name: 'Virginia', val: 'VA' },
		{ name: 'Washington', val: 'WA' },
		{ name: 'West Virginia', val: 'WV' },
		{ name: 'Wisconsin', val: 'WI' },
		{ name: 'Wyoming', val: 'WY' },
	];

	const service = {
		customerData() {
			const data = {
				states,
			};
			return data;
		},
		clearCookies() {
			$cookies.remove( 'vf.user.name', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.email', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.group_admin', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.approver', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.is-guest', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.group', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.remember', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.last_login', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.cart.cartCount', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.punchoutOnly', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.mixedPunchout', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.company', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.defaultShippingProfile', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.defaultBillingProfile', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.group_id', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.group_parent_id', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.price_availability', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.cost_center_is_required', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.user.currentGroup_id', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.cart', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.auth.token', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'vf.cart.cartCount', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
			$cookies.remove( 'force_password', {
				samesite: 'none',
				secure: true,
				path: '/',
			} );
		},
	};

	/**
	 *
	 */
	return service;
}

