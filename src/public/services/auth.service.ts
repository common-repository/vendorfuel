authService.$inject = ['$cookies', '$window'];

export function authService(
	$cookies: ng.cookies.ICookiesService,
	$window: ng.IWindowService
): void {
	const self = this;
	/**
	 * Parse a JWT.
	 *
	 * @param {string} token
	 * @return {string}
	 */

	self.parseJWT = function (token: string) {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse($window.atob(base64));
	};
	/**
	 * Save auth token and remember for 14 days if 'remember' is true.
	 *
	 * @param {string}  token
	 * @param {boolean} remember
	 * @return {string}
	 */

	self.saveToken = function (token: string, remember: boolean) {
		let cookieOptions: {
			samesite: string;
			secure: boolean;
			path: string;
			expires?: Date;
		} = {
			samesite: 'none',
			secure: true,
			path: '/',
		};

		if (remember) {
			const currentTime = new Date();
			currentTime.setDate(currentTime.getDate() + 14);
			cookieOptions = {
				samesite: 'none',
				secure: true,
				path: '/',
				expires: currentTime,
			};
		}

		$cookies.put('vf.auth.token', token, cookieOptions);
	};
	/**
	 * Retrieve auth token.
	 *
	 * @return {string}
	 */

	self.getToken = function () {
		return $cookies.get('vf.auth.token');
	};
	/**
	 * Retrieve Admin auth token A.
	 *
	 * @return {string}
	 */

	self.getAdminTokenA = function () {
		return $cookies.get('vendorfuel-admin-tokena');
	};
	/**
	 * Retrieve Admin auth token A.
	 *
	 * @return {string}
	 */

	self.getAdminTokenB = function () {
		return $cookies.get('vendorfuel-admin-tokenb');
	};

	self.getAdminJWT = function () {
		return $cookies.get('vendorfuel-admin-token');
	};
	/**
	 * Verify token is valid for authentication.
	 *
	 * @param {string} token
	 * @return {boolean}
	 */

	self.isAuthed = function (token: string) {
		token = token || self.getToken();

		if (token) {
			return !self.tokenExpired();
		}
		return false;
	};
	/**
	 * Check for expired token.
	 *
	 * @param {string} token
	 * @return {boolean}
	 */

	self.tokenExpired = function () {
		return false;
	};
	/**
	 * Clear auth token and stored auth info.
	 */

	self.clearToken = function () {
		$cookies.remove('vf.user.name', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.email', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.group_admin', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.approver', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.is-guest', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.group', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.remember', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.last_login', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.cart.cartCount', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.punchoutOnly', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.mixedPunchout', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.company', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.defaultShippingProfile', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.defaultBillingProfile', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.group_id', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.group_parent_id', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.price_availability', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.cost_center_is_required', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.user.currentGroup_id', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.cart', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.auth.token', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('vf.cart.cartCount', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		$cookies.remove('force_password', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
	};
}
