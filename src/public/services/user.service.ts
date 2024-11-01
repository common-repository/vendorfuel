import { formatURLParams } from '../common/format-url-params';
import { getIntFromCookie } from '../common/get-int-from-cookie';
import { getBool } from '../common/get-bool';

userService.$inject = [
	'$cookies',
	'$http',
	'$injector',
	'Auth',
	'Alerts',
	'Analytics',
	'Debug',
	'Utils',
];

export function userService(
	$cookies: ng.cookies.ICookiesService,
	$http: ng.IHttpService,
	$injector: ng.auto.IInjectorService,
	Auth: any,
	Alerts: any,
	Analytics: any,
	Debug: any,
	Utils: any
) {
	/**
	 * User variables.
	 */
	const self = this;
	self.name = $cookies.get('vf.user.name');
	self.email = $cookies.get('vf.user.email');

	try {
		self.group = JSON.parse($cookies.get('vf.user.group'));
	} catch (e) {
		self.group = '';
	}

	self.group_admin = getBool($cookies.get('vf.user.group_admin'));
	self.approver = getBool($cookies.get('vf.user.approver'));
	self.remember = getBool($cookies.get('vf.user.remember'));
	self.last_login = $cookies.get('vf.user.last_login');
	self.isAuthed = Auth.isAuthed();
	self.isGuest = getBool($cookies.get('vf.user.is-guest'));
	self.attemptedPage = $cookies.get('vf.user.attempted-page');
	self.cart_count = getIntFromCookie($cookies.get('vf.cart.cartCount'));
	self.punchoutOnly = getBool($cookies.get('vf.user.punchoutOnly'));
	self.mixedPunchout = getBool($cookies.get('vf.user.mixedPunchout'));
	self.company = $cookies.get('vf.user.company');
	self.defaultShippingProfile = getIntFromCookie(
		$cookies.get('vf.user.defaultShippingProfile')
	);
	self.defaultBillingProfile = getIntFromCookie(
		$cookies.get('vf.user.defaultBillingProfile')
	);
	self.group_id = getIntFromCookie($cookies.get('vf.user.group_id'));
	self.group_parent_id = getIntFromCookie(
		$cookies.get('vf.user.group_parent_id')
	);
	self.price_availability = getBool(
		$cookies.get('vf.user.price_availability')
	);
	self.cost_center_is_required = getBool(
		$cookies.get('vf.user.cost_center_is_required')
	);
	self.currentGroup_id = getIntFromCookie(
		$cookies.get('vf.user.currentGroup_id')
	);

	const update = function update(info: any) {
		self.name = info.name;
		self.email = info.email;
		self.company = info.company;
		self.group_admin = info.group_admin;
		self.approver = info.approver;
		self.isGuest = info.guest;
		self.group = info.group;
		self.last_login = info.last_login;
		self.punchoutOnly = info.punchout_only;
		self.mixedPunchout = info.mixed_punchout;
		self.defaultShippingProfile = info.default_shipping_profile;
		self.defaultBillingProfile = info.default_billing_profile;
		self.group_id = info.group_id;
		self.group_parent_id = info.group_parent_id;
		self.price_availability = info.price_availability;
		self.cost_center_is_required = info.cost_center_is_required;
		self.currentGroup_id = info.group_id;
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

		if (self.remember) {
			const currentTime = new Date();
			currentTime.setDate(currentTime.getDate() + 14);
			cookieOptions = {
				samesite: 'none',
				secure: true,
				path: '/',
				expires: currentTime,
			};
		}

		$cookies.put('vf.user.name', self.name, cookieOptions);
		$cookies.put('vf.user.email', self.email, cookieOptions);
		$cookies.put('vf.user.group_admin', self.group_admin, cookieOptions);
		$cookies.put('vf.user.approver', self.approver, cookieOptions);

		try {
			$cookies.put(
				'vf.user.group',
				JSON.stringify(self.group),
				cookieOptions
			);
		} catch (e) {
			$cookies.put('vf.user.group', '', cookieOptions);
		}

		$cookies.put('vf.user.remember', self.remember, cookieOptions);
		$cookies.put('vf.user.last_login', self.last_login, cookieOptions);
		$cookies.put('vf.cart.cartCount', self.cart_count, cookieOptions);
		$cookies.put('vf.user.punchoutOnly', self.punchoutOnly, cookieOptions);
		$cookies.put(
			'vf.user.mixedPunchout',
			self.mixedPunchout,
			cookieOptions
		);
		$cookies.put('vf.user.company', self.company, cookieOptions);
		$cookies.put(
			'vf.user.defaultShippingProfile',
			self.defaultShippingProfile,
			cookieOptions
		);
		$cookies.put(
			'vf.user.defaultBillingProfile',
			self.defaultBillingProfile,
			cookieOptions
		);
		$cookies.put('vf.user.group_id', self.group_id, cookieOptions);
		$cookies.put(
			'vf.user.group_parent_id',
			self.group_parent_id,
			cookieOptions
		);
		$cookies.put(
			'vf.user.price_availability',
			self.price_availability,
			cookieOptions
		);
		$cookies.put(
			'vf.user.cost_center_is_required',
			self.cost_center_is_required,
			cookieOptions
		);
		$cookies.put(
			'vf.user.currentGroup_id',
			self.currentGroup_id,
			cookieOptions
		);
		$cookies.put('vf.user.is-guest', self.isGuest, {
			samesite: 'none',
			secure: true,
			path: '/',
		}); //update cart service with details from login

		$injector.get('Cart').updateFromApi(info);
		Debug.log(this);
	};

	const success = function success(resp: any) {
		if (!resp.data.errors.length) {
			Auth.saveToken(resp.data.token, self.remember);
			update(resp.data);
			self.isAuthed = true;
		}

		return resp;
	};

	const clear = () => {
		Auth.clearToken();
		self.isAuthed = false;
		self.isGuest = false;
		self.name = null;
		self.email = null;
		self.company = null;
		self.group_admin = null;
		self.approver = null;
		self.group = null;
		self.last_login = null;
		self.punchoutOnly = null;
		self.mixedPunchout = null;
		self.defaultShippingProfile = 0;
		self.defaultBillingProfile = 0;
		self.group_id = null;
		self.group_parent_id = null;
		self.price_availability = null;
		self.cost_center_is_required = null;
		self.currentGroup_id = null;
	};
	/**
	 * Update a users group.
	 *
	 * @param {number} groupId
	 */

	self.updateGroup = function (groupId: number) {
		self.currentGroup_id = groupId;
		$cookies.put('vf.user.currentGroup_id', self.currentGroup_id, {
			samesite: 'none',
			secure: true,
			path: '/',
		});
	};

	/**
	 * Register a new user.
	 *
	 * @param {Object} userData
	 */
	self.register = function (userData: any) {
		const token = Auth.getToken();
		userData['prev-token'] = token;
		return $http
			.post(localized.apiURL + '/account/register', userData)
			.then(function (resp) {
				Analytics.signUp();
				return success(resp);
			});
	};
	/**
	 * User login.
	 *
	 * @param {Object} userData
	 */

	self.login = function (userData: {
		remember: boolean;
		email: string;
		password: string;
	}) {
		const token = Auth.getToken();
		clear();
		self.remember = (userData.remember && true) || false;
		return $http
			.post(localized.apiURL + '/account/login', {
				email: userData.email,
				password: userData.password,
				'prev-token': token,
			})
			.then(function (resp: any) {
				if (!resp.data.errors.length) {
					Analytics.login();
				}

				return success(resp);
			});
	};
	/**
	 * User logout.
	 *
	 * @return {Object} Response
	 */
	this.logout = () => {
		const url = `${localized.apiURL}/account/logout`;
		const data = {};
		return $http.post(url, data).then((response) => {
			clear();
			return response;
		});
	};

	/**
	 * Guest login.
	 *
	 * @return {Object}
	 */

	self.guestLogin = function () {
		clear();
		return $http
			.post(localized.apiURL + '/account/guest-login', {})
			.then(function (resp: any) {
				self.name = 'Guest';
				self.remember = false;
				Auth.saveToken(resp.data.token);
				self.isAuthed = true;
				$cookies.put('vf.user.name', self.name, {
					samesite: 'none',
					secure: true,
					path: '/',
				});
				$cookies.put('vf.user.is-guest', true, {
					samesite: 'none',
					secure: true,
					path: '/',
				});
				$cookies.put('vf.user.remember', self.remember, {
					samesite: 'none',
					secure: true,
					path: '/',
				});
				self.isGuest = true;
				Debug.log(self);
				return resp;
			});
	};
	/**
	 * Redirect to login page if a protected page has been loaded. Redirect user to requested page on login.
	 *
	 * @param {boolean} showModal
	 */

	self.redirectToLogin = function (showModal) {
		self.attemptedPage = window.location.href;
		$cookies.get('vf.user.attempted-page', self.attemptedPage);

		if (showModal && angular.element('#errorModal').length) {
			Alerts.modal({
				enabled: true,
				redirectUrl: Utils.getPageUrl('login'),
				title: 'Error',
			});
			Alerts.error('This action requires authentication');
		} else {
			window.location.href = localized.pages.login.url;
		}
	};
	/**
	 * Redirect user to attempted page after succesfull login.
	 *
	 */

	self.redirectToAttempted = function () {
		$cookies.remove('vf.user.attempted-page', {
			samesite: 'none',
			secure: true,
			path: '/',
		});

		if (
			!self.attemptedPage ||
			window.location.href === self.attemptedPage
		) {
			window.location.reload();
		} else {
			window.location.href = self.attemptedPage;
		}
	};
	/**
	 * Get general settings.
	 *
	 * @return {Object}
	 */

	self.fillInfo = function () {
		return $http
			.get(localized.apiURL + '/account/info/view')
			.then(function (resp) {
				update(resp.data.info);
				return resp;
			});
	};
	/**
	 * Get user account info.
	 *
	 * @return {Object}
	 */

	self.loadCustomer = function () {
		return $http
			.get(localized.apiURL + '/account/load')
			.then(function (resp) {
				update(resp.data);
				return resp;
			});
	};
	/**
	 * Update user account.
	 *
	 * @param {Object} userData
	 * @return {Object}
	 */

	self.updateInfo = function (userData) {
		return $http
			.post(localized.apiURL + '/account/info/modify', userData)
			.then(function (resp) {
				if (!resp.data.errors.length) {
					update(resp.data);
				}

				return resp;
			});
	};
	/**
	 * Get customer roles for registration
	 *
	 * @return {Object} - All roles and documents
	 */

	self.roles = function () {
		return $http
			.get(formatURLParams(localized.apiURL + '/roles', {}))
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Get customer roles for registration
	 *
	 * @param {number} id - The Role to retrieve
	 * @return {Object} - Role settings
	 */

	self.role = function (id) {
		return $http
			.get(formatURLParams(localized.apiURL + '/roles/' + id, {}))
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Get address profiles.
	 *
	 * @param {number} order_id
	 * @return {unresolved}
	 */

	self.getProfiles = function (order_id) {
		const params = {};

		if (typeof order_id !== 'undefined') {
			params.order_id = order_id;
		}

		return $http
			.post(localized.apiURL + '/account/address/list', params)
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Save a shipping address profile.
	 *
	 * @param {Object} profileForm
	 * @return {Object}
	 */

	self.addShippingProfile = function (profileForm) {
		const params = {
			type: 'shipping',
		};
		angular.forEach(profileForm, function (value, key) {
			params[key] = value;
		});
		return $http
			.post(localized.apiURL + '/account/address/modify', params)
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Remove a shipping address profile.
	 *
	 * @param {number} profileID
	 * @return {Object}
	 */

	self.removeShippingProfile = function (profileID) {
		return $http
			.post(localized.apiURL + '/account/address/remove', {
				type: 'shipping',
				shipping_id: profileID,
			})
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Save a billing address profile.
	 *
	 * @param {Object} profileForm
	 * @return {Object}
	 */

	self.addBillingProfile = function (profileForm) {
		const params = {
			type: 'billing',
		};
		angular.forEach(profileForm, function (value, key) {
			params[key] = value;
		});
		return $http
			.post(localized.apiURL + '/account/address/modify', params)
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Remove a billing address profile.
	 *
	 * @param {number} profileID
	 * @return {Object}
	 */

	self.removeBillingProfile = function (profileID) {
		return $http
			.post(localized.apiURL + '/account/address/remove', {
				type: 'billing',
				billing_id: profileID,
			})
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Set a default shipping or billing address profile.
	 *
	 * @param {number} profileID
	 * @param {string} type
	 * @return {Object}
	 */

	self.setDefaultProfile = function (profileID, type) {
		return $http
			.post(localized.apiURL + '/account/address/default', {
				type,
				id: profileID,
			})
			.then(function (resp) {
				update(resp.data);
				return resp;
			});
	};
	/**
	 * List completed orders for the current user.
	 *
	 * @param {Object} params
	 */
	this.listOrders = (params: any) => {
		const url = `${localized.apiURL}/account/orders`;
		return $http.get(url, {
			params,
			paramSerializer: '$httpParamSerializerJQLike',
		});
	};
	/**
	 * View completed order.
	 *
	 * @param {boolean} orderBy
	 * @return {unresolved}
	 */

	self.viewOrder = function (order_id) {
		const params = {};

		if (typeof order_id !== 'undefined') {
			params.order_id = order_id;
		}

		return $http.post(localized.apiURL + '/account/order/view', params);
	};
	/**
	 * Checkout STUB.
	 */

	self.checkout = function () {
		Debug.log('checkout function here');
	};

	/**
	 * Add RMA to an order.
	 *
	 * @param {number} purchId
	 * @param {string} notes
	 * @param {string} reason
	 * @param {number} qty
	 */
	this.addRma = (
		purchId: number,
		notes: string,
		reason: string,
		qty: number
	) => {
		const url = `${localized.apiURL}/account/rma/request`;
		const params = {
			purch_id: purchId,
			notes,
			reason,
			qty,
		};
		return $http.post(url, params);
	};

	/**
	 * Request a password reset.
	 *
	 * @param {string} email
	 * @param {string} url
	 * @return {unresolved}
	 */

	self.requestPasswordReset = function (email, url) {
		const params = {
			email,
			url,
		};
		return $http.post(
			localized.apiURL + '/account/password-reset/request',
			params
		);
	};
	/**
	 * Validate password reset.
	 *
	 * @param {string}  code
	 * @param {boolean} auth
	 * @return {unresolved}
	 */

	self.validatePasswordReset = function (code, auth) {
		const params = {
			code,
			auth,
		};
		return $http.post(
			localized.apiURL + '/account/password-reset/validate',
			params
		);
	};
	/**
	 * Reset password.
	 *
	 * @param {string}  code
	 * @param {boolean} auth
	 * @param {string}  question
	 * @param {string}  answer
	 * @param {string}  pass
	 * @param {boolean} verify
	 * @return {unresolved}
	 */

	self.resetPassword = function (code, auth, question, answer, pass, verify) {
		const params = {
			code,
			auth,
		};

		if (typeof question !== 'undefined') {
			params.security_qa_id = question;
		}

		if (answer !== '') {
			params.security_answer = answer;
		}

		params.password = pass;
		params.retype_password = verify;
		return $http.post(
			localized.apiURL + '/account/password-reset/submit',
			params
		);
	};
	/**
	 * Forced password reset.
	 *
	 * @param {string} password
	 * @return {unresolved}
	 */
	this.forcedResetPassword = (password: string) => {
		const url = `${localized.apiURL}/account/info/modify`;
		const params = {
			password,
			password_confirmation: password,
			name: self.name,
			email: self.email,
		};
		return $http.post(url, params);
	};

	/**
	 * Get banner for specified area.
	 *
	 * @param {string} area
	 * @return {unresolved}
	 */

	self.getBanner = function (area: string) {
		const params = {
			area,
		};
		return $http.post(localized.apiURL + '/catalog/banner/view', params);
	};

	self.sendOrderEmail = function (order_id: number) {
		const params = {
			order_id,
		};
		return $http.post(
			localized.apiURL + '/account/order/resend-email',
			params
		);
	};

	this.resendVerificationEmail = (email: string, returnUrl: string) => {
		const data = {
			email,
			verification_return_url: returnUrl,
		};
		const url = `${localized.apiURL}/account/email/link`;
		return $http.post(url, data);
	};

	this.verifyEmail = (auth: string, code: string) => {
		const data = {
			auth,
			code,
		};
		const url = `${localized.apiURL}/account/email/verify`;
		return $http.post(url, data);
	};
}
