import { formatURLParams } from '../../common/format-url-params';
import { getIntFromCookie } from '../../common/get-int-from-cookie';

cartService.$inject = [
	'$cookies',
	'$http',
	'$q',
	'Alerts',
	'Analytics',
	'Debug',
	'User',
	'Utils',
];

export function cartService(
	$cookies: ng.cookies.ICookiesService,
	$http: ng.IHttpService,
	$q: ng.IQService,
	Alerts: any,
	Analytics: any,
	Debug: any,
	User: any,
	Utils: any
) {
	const self = this;
	self.details = null;
	self.shipping_methods = null;

	try {
		self.items = JSON.parse($cookies.get('vf.cart'));
	} catch (e) {
		self.items = {};
	}

	self.cartCount = getIntFromCookie($cookies.get('vf.cart.cartCount'));
	self.zipCode = getIntFromCookie($cookies.get('vf.cart.zip'));
	self.county = $cookies.get('vf.cart.county');
	self.selectedShipping = getIntFromCookie(
		$cookies.get('vf.cart.selectedShipping')
	);
	self.squareUpPaymentForm = null;
	self.paymentMethod = null;
	self.sandboxEnabled = false;
	self.user = User;
	self.squareUpAppID = null;

	self.authorizeCard = function () {
		switch (self.getPaymentMethod()) {
			case 'squareup':
				self.squareUpPaymentForm.requestCardNonce();
				break;
		}
	};

	self.getPaymentMethod = function () {
		return self.paymentMethod;
	};

	self.setPaymentMethod = function (payment_method) {
		self.paymentMethod = payment_method;
	};

	self.getShippingMethodID = function () {
		return self.selectedShippingMethodID;
	};

	self.setShippingMethodID = function (shipping_method_id) {
		self.selectedShippingMethodID = shipping_method_id;
	};

	self.loadPaymentForm = function () {};

	self.getAuthnetPaymentFormTemplate = function () {
		return 'https://api.vendorfuel.com/assets/templates/authnet-payment-form.html';
	};

	self.getSquareUpApplicationID = function () {
		if (!self.sandboxEnabled) {
			return 'sq0idp-XSN1fN7oGs4Q2Unob4UfSQ';
		}
		return 'sandbox-sq0idb-7JFysyB76m-8lyoWdvkp2Q';
	};

	self.getSquareUpPaymentFormTemplate = function () {
		return 'https://api.vendorfuel.com/assets/templates/squareup-payment-form.html';
	};

	self.loadSquareUpPaymentForm = function () {
		self.setPaymentMethod('squareup');

		if (!self.squareUpPaymentForm) {
			self.squareUpPaymentForm = new SqPaymentForm({
				// Initialize the payment form elements
				applicationId: self.getSquareUpApplicationID(),
				inputClass: 'sq-input',
				autoBuild: false,
				// Customize the CSS for SqPaymentForm iframe elements
				inputStyles: [
					{
						fontSize: '16px',
						lineHeight: '24px',
						padding: '16px',
						placeholderColor: '#a0a0a0',
						backgroundColor: 'transparent',
					},
				],
				// Initialize the credit card placeholders
				cardNumber: {
					elementId: 'sq-card-number',
					placeholder: 'Card Number',
				},
				cvv: {
					elementId: 'sq-cvv',
					placeholder: 'CVV',
				},
				expirationDate: {
					elementId: 'sq-expiration-date',
					placeholder: 'MM/YY',
				},
				postalCode: {
					elementId: 'sq-postal-code',
					placeholder: 'Postal',
				},
				// SqPaymentForm callback functions
				callbacks: {
					/*
					 * callback function: cardNonceResponseReceived
					 * Triggered when: SqPaymentForm completes a card nonce request
					 */
					cardNonceResponseReceived:
						function cardNonceResponseReceived(
							errors,
							nonce,
							cardData
						) {
							if (errors) {
								// Log errors from nonce generation to the browser developer console.
								console.error('Encountered errors:');
								errors.forEach(function (error) {
									console.error('  ' + error.message);
								});
								alert(
									'Encountered errors, check browser developer console for more details'
								);
								return;
							}

							Debug.log(cardData); //TODO: Replace alert with code in step 2.1

							self.sq_nonce = nonce;
							$scope.payment_info.cc_type = cardData.card_brand;
							$scope.payment_info.cc_num = cardData.last_4;
							self.completeOrder();
						},
				},
			});
			self.squareUpPaymentForm.build();
		}
	};

	const updateStorage = function updateStorage() {
		$cookies.put('vf.cart', JSON.stringify(self.items), {
			samesite: 'none',
			secure: true,
			path: '/',
		});
	};

	const setSelectedShippingToDefault =
		function setSelectedShippingToDefault() {
			for (const id in self.shipping_methods) {
				if (
					Object.prototype.hasOwnProperty.call(
						self.shipping_methods,
						id
					)
				) {
					Debug.log(id);
					$cookies.put('vf.cart.selectedShipping', id, {
						samesite: 'none',
						secure: true,
						path: '/',
					});
					self.selectedShipping = id;
					return id;
				}
			}
		};

	self.updateFromApi = function (data) {
		self.details = data.cart;
		self.shipping_methods = data.shipping_methods;

		if (!angular.isUndefined(data.cart_count)) {
			self.cartCount = getIntFromCookie(data.cart_count);
			$cookies.put('vf.cart.cartCount', data.cart_count, {
				samesite: 'none',
				secure: true,
				path: '/',
			});
		} else {
			$cookies.put('vf.cart.cartCount', 0, {
				samesite: 'none',
				secure: true,
				path: '/',
			});
		}

		self.items = {};

		if (self.cartCount > 0 && self.details) {
			angular.forEach(self.details.items, function (item, key) {
				self.items[key] = item.qty;
			});
		}

		updateStorage();
	};
	/**
	 * Adding multiple items to the cart.
	 *
	 * @param {Object} products The keys are product ids and the values are the qtys.
	 * @return {unresolved}
	 */

	self.addItems = function (products) {
		// Because of the way the api is currently reading the ids and qtys, we have to re-arrange things here.
		// Api should be fixed to instead accept an associative array of id->qty ...
		const ids = [];
		const paramData = {}; // setting up values to pass to api

		angular.forEach(products, function (qty, id) {
			ids.push(id);
			products[id] = parseInt(qty);
		});

		if (ids.length < 1) {
			return $q.when(false);
		} else if (ids.length === 1) {
			paramData.product_id = ids[0];
			paramData.qty = products[ids[0]];
		} else {
			paramData.product_id = ids;
			paramData.qty = products;
		} // make sure the user is logged in before continuing

		let loginCheck;

		if (!User.isAuthed) {
			loginCheck = User.guestLogin();
		} else {
			loginCheck = $q.when(true);
		}

		return loginCheck
			.then(function (resp) {
				if (resp.data && resp.data.errors && resp.data.errors.length) {
					return resp;
				} // add to cart

				return $http.post(localized.apiURL + '/cart/add', paramData);
			})
			.then(function (resp) {
				if (resp.data && resp.data.errors && resp.data.errors.length) {
					return resp;
				}

				angular.forEach(products, function (qty, id) {
					// Successfully added to cart
					if (angular.isUndefined(self.items[id])) {
						self.items[id] = 0;
					}

					self.items[id] += qty;
					self.cartCount += qty;
				});
				self.updateFromApi(resp.data);
				Analytics.addToCart(resp.data);

				if (localized.settings.general.redirectToCart) {
					Utils.goToPage('cart');
				}

				return resp;
			});
	};
	/**
	 * Add an item to the cart.
	 *
	 * @param {number} productId
	 * @param {number} qty
	 * @return {unresolved}
	 */

	self.add = function (productId, qty) {
		const products = {};
		products[productId] = qty;
		return self.addItems(products);
	};
	/**
	 * Remove item(s) from the cart.
	 *
	 * @param {number | Array} productId
	 * @return {unresolved}
	 */

	self.remove = function (productId) {
		return $http
			.post(localized.apiURL + '/cart/remove', {
				product_id: productId,
			})
			.then(function (resp) {
				if (self.details) {
					delete self.details.items[productId];
					Analytics.removeFromCart(resp.data);
					return self.update();
				}

				return resp;
			});
	};
	/**
	 * Update quantities in the cart. The qty argument is only a guard for preventing the update
	 * when an empty string is passed in.
	 *
	 * @param {number | string} qty (Optional)
	 * @return {unresolved}
	 */

	self.update = function (qty, product_id) {
		if (qty === '') {
			// Empty string, don't update cart until a qty is actually entered.
			// undefined qty will still call update with qty of 1
			// this just sets a guard on entering a qty, so backspace can be used if fields
			return $q.when(false);
		}

		if (typeof product_id === 'undefined') {
			return $q.when(false);
		}
		self.details.items[product_id].qty = qty;

		return $http
			.post(localized.apiURL + '/cart/update', {
				items: JSON.stringify(self.details.items[product_id]),
			})
			.then(function (resp) {
				self.updateFromApi(resp.data);
				return resp;
			});
	};
	/**
	 * Clear out the cart.
	 *
	 * @return {unresolved}
	 */

	self.clear = function () {
		return $http.post(localized.apiURL + '/cart/clear', {}).then((resp) => {
			self.updateFromApi(resp.data);
			return resp;
		});
	};
	/**
	 * Clear out the cart.
	 *
	 * @return {unresolved}
	 */

	self.quote = function (name, contact) {
		return $http.post(localized.apiURL + '/cart/request-quote', {
			name,
			contact,
		});
	};

	self.csv = function () {
		$http.post(localized.apiURL + '/cart/csv');
	};

	/**
	 * Get the qty for a product id.
	 *
	 * @param {number} productId
	 * @return {number}
	 */

	self.getQty = function (productId) {
		return self.items[productId] || 0;
	};
	/**
	 * Get and fill the cart details into this service.
	 *
	 * @return {unresolved}
	 */

	self.fillDetails = function () {
		const params = {};
		params.zipcode = self.zipCode;
		params.county = self.county;
		params.shipping_method = self.selectedShipping;
		return $http
			.get(formatURLParams(localized.apiURL + '/cart/view', params))
			.then(function (resp) {
				self.updateFromApi(resp.data);

				if (!self.selectedShipping) {
					setSelectedShippingToDefault();
				}

				return resp;
			});
	};

	/**
	 * Store a copy of the current cart with the given title.
	 *
	 * @param {string} cartTitle
	 */
	this.save = (cartTitle: string) => {
		let url = `${localized.apiURL}/cart/saved/modify`;
		const data = {
			cart_title: cartTitle,
		};
		return $http.post(url, data).then((response: any) => {
			if (!response.data.saved_cart_id) {
				return $q.reject(response);
			}

			url = `${localized.apiURL}/cart/saved/item/add`;
			const paramData = {
				saved_cart_id: response.data.saved_cart_id,
				product_id: [] as number[],
				qty: {} as number[],
			};

			angular.forEach(self.items, (qty, id) => {
				paramData.product_id.push(id);
				paramData.qty[id] = qty;
			});

			return $http.post(url, paramData).then((addResp) => {
				Alerts.message('Cart has been saved.');
				return addResp;
			});
		});
	};

	/**
	 * Get a list of saved carts.
	 *
	 */
	this.getSavedList = () => {
		const url = `${localized.apiURL}/cart/saved/list`;
		return $http.get(url).then(function (response: any) {
			return response.data.saved_carts;
		});
	};

	/**
	 * Get a saved cart.
	 *
	 * @param {number} savedCartId
	 * @return {unresolved}
	 */

	self.getSaved = function (savedCartId) {
		return $http
			.get(
				formatURLParams(localized.apiURL + '/cart/saved/view', {
					saved_cart_id: savedCartId,
				})
			)
			.then(function (resp) {
				return {
					cart_title: resp.data.cart_title,
					saved_cart_id: resp.data.saved_cart_id,
					subtotal: resp.data.subtotal,
					items: resp.data.items,
				};
			});
	};

	self.getFavorites = function () {
		return $http
			.post(localized.apiURL + '/cart/favorites/view', {})
			.then(function (resp) {
				return resp;
			});
	};

	self.addFavorite = function (params) {
		return $http
			.post(localized.apiURL + '/cart/favorites/add', params)
			.then(function (resp) {
				return resp;
			});
	};

	self.removeFavorite = function (params) {
		return $http
			.post(localized.apiURL + '/cart/favorites/remove', params)
			.then(function (resp) {
				return resp;
			});
	};
	/**
	 * Delete a saved cart.
	 *
	 * @param {number} savedCartId
	 * @return {unresolved}
	 */

	self.deleteSaved = function (savedCartId) {
		return $http.post(localized.apiURL + '/cart/saved/remove', {
			saved_cart_id: savedCartId,
		});
	};
	/**
	 * Remove an item from the specified saved cart.
	 *
	 * @param {number} savedCartId
	 * @param {number} productId
	 * @return {unresolved}
	 */

	self.removeSavedItem = function (savedCartId, productId) {
		return $http.post(localized.apiURL + '/cart/saved/item/remove', {
			product_id: productId,
			saved_cart_id: savedCartId,
		});
	};

	self.addPromoCode = function (promoCode) {
		if (angular.isUndefined(promoCode) || promoCode.length < 1) {
			return $q.when(false);
		}

		return $http
			.post(localized.apiURL + '/cart/promo-code/add', {
				promo_code: promoCode,
			})
			.then(function (resp) {
				if (resp.data.promo_code_id) {
					self.updateFromApi(resp.data);
				}

				return resp;
			});
	};

	self.removePromoCode = function (promoCodeId) {
		return $http
			.post(localized.apiURL + '/cart/promo-code/remove', {
				promo_code_id: promoCodeId,
			})
			.then(function (resp) {
				if (resp.data.promo_code_id) {
					self.updateFromApi(resp.data);
				}

				return resp;
			});
	};

	self.setZip = function (zip) {
		$cookies.put('vf.cart.zip', zip, {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		self.zipCode = zip;
		return self.fillDetails().then(function (resp) {
			if (!self.selectedShipping) {
				setSelectedShippingToDefault();
			}

			return resp;
		});
	};

	self.setCounty = function (county) {
		$cookies.put('vf.cart.county', county, {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		self.county = county;
		return self.fillDetails();
	};

	self.setSelectedShipping = function (selectedShipping) {
		$cookies.put('vf.cart.selectedShipping', selectedShipping, {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		self.selectedShipping = selectedShipping;
	};

	self.clearShipping = function () {
		$cookies.remove('vf.cart.zip', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		delete self.zipCode;
		$cookies.remove('vf.cart.county', {
			samesite: 'none',
			secure: true,
			path: '/',
		});
		delete self.county;
		setSelectedShippingToDefault();
		return $q.when(true);
	};

	self.partialCheckout = function (items) {
		Debug.log(items);
		let totalCheck = 0;
		angular.forEach(items, function (qty) {
			totalCheck += qty;
		});

		if (totalCheck === 0) {
			Alerts.message('You must include at least one item to checkout.');
		} else {
			$cookies.put('vf.cart.partial', JSON.stringify(items), {
				samesite: 'none',
				secure: true,
				path: '/',
			});
		}

		return $q.when(true);
	};

	self.addBySku = function (sku, qty) {
		qty = parseInt(qty) || 1;
		return $http
			.post(localized.apiURL + '/cart/add-sku', {
				sku,
				qty,
			})
			.then(function (resp) {
				Debug.log(resp);
				return resp;
			});
	};

	self.getShippingMethods = function (order_id, profile_id, zipcode) {
		const params = {
			order_id,
			shipping_id: profile_id,
			zipcode,
		};
		return $http
			.post(localized.apiURL + '/cart/order/shipping/methods', params)
			.then(function (resp) {
				return resp;
			});
	};

	self.checkout = function (paypal, return_url, cancel_url, shipping_id) {
		const params = {};

		if (typeof paypal !== 'undefined') {
			params.paypal = paypal;
			params.return_url = return_url;
			params.cancel_url = cancel_url;
		}

		if ($cookies.get('vf.cart.partial') !== null) {
			try {
				params.items = JSON.parse($cookies.get('vf.cart.partial'));
			} catch (e) {
				params.items = {};
			}
		}

		if (shipping_id) {
			params.shipping_id = shipping_id;
		}

		return $http
			.post(localized.apiURL + '/cart/checkout', params)
			.then(function (resp) {
				$cookies.put('vf.cart.partial', null, {
					samesite: 'none',
					secure: true,
					path: '/',
				});
				Analytics.beginCheckout(resp.data);
				return resp;
			});
	};

	self.priceAvailabilityResponse = function (
		order,
		price_availability_response,
		reconfirm
	) {
		const params = {};
		params.order_id = order.order.order_id;
		params.return_url = order.return_url;
		params.price_availability_response = price_availability_response;
		params.reconfirm = reconfirm;
		return $http
			.post(localized.apiURL + '/cart/order/price-availability', params)
			.then(function (resp) {
				return resp;
			});
	};

	self.confirmOrder = function (checkout_info) {
		const params = {};
		params.shipping_id =
			checkout_info.selected_shipping_profile.shipping_id;
		params.billing_id = checkout_info.selected_billing_profile.billing_id;
		params.order_id = checkout_info.order.order_id;
		params.shipping_method = checkout_info.selected_shipping_method;
		params.shipping_first_name = checkout_info.shipping_first_name;
		params.shipping_last_name = checkout_info.shipping_last_name;
		params.shipping_email = checkout_info.shipping_email;
		params.shipping_address1 = checkout_info.shipping_address1;
		params.shipping_address2 = checkout_info.shipping_address2;
		params.shipping_city = checkout_info.shipping_city;
		params.shipping_state = checkout_info.shipping_state;
		params.shipping_zip = checkout_info.shipping_zip;
		params.shipping_phone = checkout_info.shipping_phone;
		params.billing_first_name = checkout_info.billing_first_name;
		params.billing_last_name = checkout_info.billing_last_name;
		params.billing_email = checkout_info.billing_email;
		params.billing_address1 = checkout_info.billing_address1;
		params.billing_address2 = checkout_info.billing_address2;
		params.billing_city = checkout_info.billing_city;
		params.billing_state = checkout_info.billing_state;
		params.billing_zip = checkout_info.billing_zip;
		params.billing_phone = checkout_info.billing_phone;
		params.return_url = checkout_info.return_url;

		if (localized.settings.general.checkout.company_name_option) {
			params.organization = checkout_info.extraFields.organization;
		}

		if (localized.settings.general.checkout.purchase_order_option) {
			params.rr_po_num = checkout_info.extraFields.rr_po_num;
		}

		if (localized.settings.general.checkout.issuing_office_option) {
			params.issuing_office = checkout_info.extraFields.issuing_office;
		}

		if (localized.settings.general.checkout.cost_center_option) {
			params.cost_center_code =
				checkout_info.extraFields.cost_center_code;
		}

		if (localized.settings.general.checkout.attention_option) {
			params.attention = checkout_info.extraFields.attention;
		}

		if (localized.settings.general.checkout.notes_option) {
			params.notes = checkout_info.extraFields.notes;
		}

		if (checkout_info.extraFields.f1 !== '') {
			params.f1 = checkout_info.extraFields.f1;
		}

		if (checkout_info.extraFields.f2 !== '') {
			params.f2 = checkout_info.extraFields.f2;
		}

		if (checkout_info.extraFields.f3 !== '') {
			params.f3 = checkout_info.extraFields.f3;
		}

		if (checkout_info.extraFields.f4 !== '') {
			params.f4 = checkout_info.extraFields.f4;
		}

		if (checkout_info.extraFields.f5 !== '') {
			params.f5 = checkout_info.extraFields.f5;
		}

		if (checkout_info.extraFields.f6 !== '') {
			params.f6 = checkout_info.extraFields.f6;
		}

		return $http
			.post(localized.apiURL + '/cart/order/confirm', params)
			.then(function (resp) {
				return resp;
			});
	};

	self.confirmPaypalOrder = function (checkout_info) {
		const params = {}; //	params.shipping_id=checkout_info.selected_shipping_profile.shipping_id;
		//	params.billing_id=checkout_info.selected_billing_profile.billing_id;

		params.order_id = checkout_info.order.order_id;
		params.paypal = 1;
		params.shipping_method = checkout_info.selected_shipping_method;
		params.shipping_first_name = checkout_info.shipping_first_name;
		params.shipping_last_name = checkout_info.shipping_last_name;
		params.shipping_email = checkout_info.shipping_email;
		params.shipping_address1 = checkout_info.shipping_address1;
		params.shipping_address2 = checkout_info.shipping_address2;
		params.shipping_city = checkout_info.shipping_city;
		params.shipping_state = checkout_info.shipping_state;
		params.shipping_zip = checkout_info.shipping_zip;
		params.shipping_phone = checkout_info.shipping_phone;
		params.billing_first_name = checkout_info.billing_first_name;
		params.billing_last_name = checkout_info.billing_last_name;
		params.billing_email = checkout_info.billing_email;
		params.billing_address1 = checkout_info.billing_address1;
		params.billing_address2 = checkout_info.billing_address2;
		params.billing_city = checkout_info.billing_city;
		params.billing_state = checkout_info.billing_state;
		params.billing_zip = checkout_info.billing_zip;
		params.billing_phone = checkout_info.billing_phone;

		if (typeof checkout_info.paymentId !== 'undefined') {
			params.paymentId = checkout_info.paymentId;
		}

		if (localized.settings.general.checkout.company_name_option) {
			params.organization = checkout_info.extraFields.organization;
		}

		if (localized.settings.general.checkout.purchase_order_option) {
			params.rr_po_num = checkout_info.extraFields.rr_po_num;
		}

		if (localized.settings.general.checkout.issuing_office_option) {
			params.issuing_office = checkout_info.extraFields.issuing_office;
		}

		if (localized.settings.general.checkout.cost_center_option) {
			params.cost_center_code =
				checkout_info.extraFields.cost_center_code;
		}

		if (localized.settings.general.checkout.attention_option) {
			params.attention = checkout_info.extraFields.attention;
		}

		if (localized.settings.general.checkout.notes_option) {
			params.notes = checkout_info.extraFields.notes;
		}

		if (checkout_info.extraFields.f1 !== '') {
			params.f1 = checkout_info.extraFields.f1;
		}

		if (checkout_info.extraFields.f2 !== '') {
			params.f2 = checkout_info.extraFields.f2;
		}

		if (checkout_info.extraFields.f3 !== '') {
			params.f3 = checkout_info.extraFields.f3;
		}

		if (checkout_info.extraFields.f4 !== '') {
			params.f4 = checkout_info.extraFields.f4;
		}

		if (checkout_info.extraFields.f5 !== '') {
			params.f5 = checkout_info.extraFields.f5;
		}

		if (checkout_info.extraFields.f6 !== '') {
			params.f6 = checkout_info.extraFields.f6;
		}

		return $http
			.post(localized.apiURL + '/cart/order/confirm', params)
			.then(function (resp) {
				return resp;
			});
	};

	self.completeOrder = function (params) {
		return $http
			.post(localized.apiURL + '/cart/order/complete', params)
			.then(function (resp) {
				Analytics.purchase(resp.data);
				return resp;
			});
	};

	self.payfabricUrl = function (return_url, order_id) {
		const params = {};
		params.return_url = return_url;
		params.order_id = order_id;
		return $http
			.post(localized.apiURL + '/cart/order/payfabricUrl', params)
			.then(function (resp) {
				return resp.data.payfabric_url;
			});
	};
}
