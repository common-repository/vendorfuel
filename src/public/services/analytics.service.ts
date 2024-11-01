type EventName =
	| 'add_to_cart'
	| 'begin_checkout'
	| 'conversion'
	| 'login'
	| 'purchase'
	| 'remove_from_cart'
	| 'search'
	| 'sign_up'
	| 'view_item'
	| 'view_search_results';

interface Item {
	currency?: 'USD';
	price?: number;
	quantity?: number;
}

interface APIItem extends Item {
	id: string;
	name: string;
	brand?: string;
	category?: string;
}

interface GA4Item extends Item {
	item_id: string;
	item_name: string;
	item_brand?: string;
	item_category?: string;
}

export function analyticsService() {
	const self = this;
	window.dataLayer = window.dataLayer || [];

	function gtag() {
		dataLayer.push(arguments);
	}

	gtag('js', new Date());

	try {
		if (localized.settings.analytics.UA.enabled) {
			this.UAEnabled = true;
			gtag('config', localized.settings.analytics.UA.id);
		} else {
			this.UAEnabled = false;
		}
	} catch (e) {
		console.warn(e.message);
		this.UAEnabled = false;
	}

	try {
		if (localized.settings.analytics.AW.enabled) {
			this.AWEnabled = true;
			gtag('config', localized.settings.analytics.AW.id);
		} else {
			this.AWEnabled = false;
		}

		if (localized.settings.analytics.conversions.phone.enabled) {
			gtag(
				'config',
				localized.settings.analytics.AW.id +
					'/' +
					localized.settings.analytics.conversions.phone.tag,
				{
					phone_conversion_number:
						localized.settings.analytics.conversions.phone.number,
				}
			);
		}
	} catch (e) {
		console.warn(e.message);
		this.AWEnabled = false;
	}
	/**
	 * Send any event
	 *
	 * @param {string} eventName
	 * @param {Object} data
	 */

	const reportEvent = (eventName: EventName, data: any) => {
		if (this.UAEnabled || this.AWEnabled) {
			try {
				gtag('event', eventName, data);
			} catch (e) {
				console.warn(e.message);
			}
		}
	};

	const convertedItems = (items: APIItem[]): GA4Item[] => {
		// Convert API item data to GA4 format.
		return items.map((item) => {
			return {
				item_id: item.id,
				item_brand: item.brand,
				item_category: item.category,
				item_name: item.name,
				price: item.price,
				quantity: item.quantity,
			};
		});
	};

	this.addToCart = (cart: {
		added_value: number;
		added_items: APIItem[];
	}) => {
		try {
			reportEvent('add_to_cart', {
				currency: 'USD',
				value: cart.added_value,
				items: convertedItems(cart.added_items),
			});
		} catch (e) {
			console.warn(e.message);
		}
	};

	this.beginCheckout = (order: {
		order: { total_amt: number };
		checkout_items: APIItem[];
	}) => {
		try {
			reportEvent('begin_checkout', {
				currency: 'USD',
				value: order.order.total_amt,
				items: convertedItems(order.checkout_items),
			});
		} catch (e) {
			console.warn(e.message);
		}
	};

	this.login = () => {
		try {
			reportEvent('login', {
				method: 'VendorFuel',
			});
		} catch (e) {
			console.warn(e.message);
		}
	};

	this.purchase = (order: {
		order_info: {
			order_id: number;
			shipping: number;
			tax: number;
			total_amt: number;
		};
		purchased_items: APIItem[];
	}) => {
		try {
			if (localized.settings.analytics.UA.enabled) {
				reportEvent('purchase', {
					currency: 'USD',
					affiliation: 'VendorFuel online store',
					value: order.order_info.total_amt,
					transaction_id: order.order_info.order_id,
					tax: order.order_info.tax,
					shipping: order.order_info.shipping,
					items: order.purchased_items,
				});
			}

			if (
				localized.settings.analytics.AW.enabled &&
				localized.settings.analytics.conversions.purchase.enabled
			) {
				reportEvent('conversion', {
					send_to:
						localized.settings.analytics.AW.id +
						'/' +
						localized.settings.analytics.conversions.purchase.tag,
					transaction_id: order.order_info.order_id,
					currency: 'USD',
					value: order.order_info.total_amt,
				});
			}
		} catch (e) {
			console.warn(e.message);
		}
	};

	this.removeFromCart = (cart: {
		removed_value: number;
		removed_items: APIItem[];
	}) => {
		try {
			reportEvent('remove_from_cart', {
				currency: 'USD',
				value: cart.removed_value,
				items: cart.removed_items,
			});
		} catch (e) {
			console.warn(e.message);
		}
	};

	this.search = (term: string) => {
		try {
			if (term?.length > 0) {
				reportEvent('search', {
					search_term: term,
				});
			}
		} catch (e) {
			console.warn(e.message);
		}
	};

	this.signUp = () => {
		try {
			reportEvent('sign_up', {
				method: 'VendorFuel',
			});
		} catch (e) {
			console.warn(e.message);
		}
	};
	/**
	 * View Item event
	 *
	 * @param {Object} product - The product that was retrieved.
	 */

	this.viewItem = (product: {
		sku: any;
		description: any;
		manufacturer: any;
		cat_title: any;
		price: any;
	}) => {
		try {
			reportEvent('view_item', {
				items: [
					{
						id: product.sku,
						name: product.description,
						list_name: 'Product Details',
						brand: product.manufacturer,
						category: product.cat_title,
						price: product.price,
					},
				],
			});
		} catch (e) {
			console.warn(e.message);
		}
	};
	/**
	 * View Search Results event
	 *
	 * @param {string} term     - The term that was searched for
	 * @param {Object} products - The products return from this search.
	 */

	this.viewSearchResults = (term: string, products: string | any[]) => {
		try {
			const reportProducts = [];

			for (let i = 0; i < products.length; i++) {
				const product = products[i];
				reportProducts[i] = {
					id: product.sku,
					name: product.description,
					list_name: 'Search Results',
					brand: product.manufacturer ? product.manufacturer : null,
					category: product.category ? product.category.title : null,
					list_position: i,
					price: product.price,
				};
			}

			const data: { search_term?: string; items: any[] } = {
				items: reportProducts,
			};

			if (term) {
				data.search_term = term;
			}

			reportEvent('view_search_results', data);
		} catch (e) {
			console.warn(e.message);
		}
	};
}
