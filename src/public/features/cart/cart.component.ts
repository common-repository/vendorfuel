import angular from 'angular';
import template from './cart.component.html';
import type { Localized } from '../../types';

declare const localized: Localized;

interface ShippingMethod {
	freeIfTotal: boolean;
	freeOrderTotal: number;
}

export const CartComponent: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$location', 'Auth', 'Cart', 'Utils'];

function controller(
	$location: ng.ILocationService,
	Auth: {
		isAuthed: () => boolean;
	},
	Cart: {
		clear: () => Promise<void>;
		fillDetails: () => Promise<any>;
	},
	Utils: {
		getPageUrl: (pageIndex: string, params?: any) => string;
	}
) {
	const vm = this;
	this.showFreeShipping = localized.settings.general.showFreeShipping;

	this.$onInit = () => {
		vm.isAuthed = Auth.isAuthed();
		vm.pageUrls = {
			catalog: Utils.getPageUrl('catalog'),
			login: Utils.getPageUrl('login', { redirect_to: $location.path() }),
		};

		if (vm.isAuthed) {
			this.getCart();
		}
	};

	this.getCart = () => {
		vm.isLoading = true;
		Cart.fillDetails().then((response) => {
			vm.cartCount = response.data.cart_count;
			if (response.data.cart) {
				vm.cart = response.data.cart;
				vm.subtotal = this.toNumber(vm.cart.subtotal);
				vm.totalAmount = this.toNumber(vm.cart.total_amount);
				angular.forEach(vm.cart.items, (item) => {
					item.price = this.toNumber(item.price);
					item.item_total = this.toNumber(item.item_total);
					item.isFavorite = item.favorite;
				});
				vm.promoCodes = vm.cart.promo_codes;
				vm.promoDiscount = vm.cart.promo_discount;
				this.setMinOrderAmount(response.data.shipping_methods);
				vm.isLoading = false;
			} else {
				vm.cart = null;
				vm.subtotal = 0;
				vm.totalAmount = 0;
				vm.isLoading = false;
			}
		});
	};

	this.setMinOrderAmount = (shippingMethods: ShippingMethod[]) => {
		if (shippingMethods) {
			const filteredMethods = shippingMethods.filter(
				(method: ShippingMethod) => method.freeIfTotal
			);

			if (filteredMethods.length) {
				return (this.minOrderAmount = Math.min(
					...filteredMethods.map(
						(method: ShippingMethod) => method.freeOrderTotal
					)
				));
			}
		}
	};

	/**
	 * @param {Object} data Response data from Cart.update, which essentially returns the cart data.
	 */
	this.updateCart = (data) => {
		vm.cart = data.cart;
		vm.cartCount = data.cart_count;
		vm.subtotal = this.toNumber(vm.cart.subtotal);
		vm.totalAmount = this.toNumber(vm.cart.total_amount);

		angular.forEach(vm.cart.items, (value) => {
			value.price = this.toNumber(value.price);
			value.item_total = this.toNumber(value.item_total);
		});
	};

	this.clear = () => {
		Cart.clear().then(() => {
			vm.cart = null;
			vm.cartCount = 0;
			vm.subtotal = 0;
			vm.totalAmount = 0;
		});
	};

	/**
	 * @param {number | string} num Number or string to be converted to a true number fo Angular to format.
	 * @return {number} Number
	 */
	this.toNumber = (num: number | string) => {
		return angular.isNumber(num) ? num : Number(num.replace(',', ''));
	};
}
