import template from './favorites-list-item.component.html';

interface Product {
	available_qty: number;
	cart_qty: number;
	status: string;
}

export const FavoritesListItem: ng.IComponentOptions = {
	bindings: {
		item: '<',
		index: '<',
	},
	controller,
	require: {
		listController: '^favoritesList',
	},
	template,
};

controller.$inject = ['$http', 'Cart'];

function controller($http: ng.IHttpService, Cart) {
	this.isInProgress = false;

	this.$onInit = () => {
		this.item.isChecked = false;
		this.productSlug =
			localized.settings.general.product_slug || 'products';
	};

	this.isAvailable = (product: Product): boolean => {
		return (
			product?.available_qty !== 0 &&
			product?.cart_qty === 0 &&
			product?.status !== 'discontinued'
		);
	};

	this.addToCart = (qty: number, productId: number) => {
		this.isInProgress = true;
		Cart.add(productId, qty).then(() => {
			this.item.cart_qty = qty;
			this.isInProgress = false;
		});
	};

	this.removeFavorite = (id: number) => {
		const url = `${localized.apiURL}/cart/favorites/remove`;
		const data = {
			product_id: id,
		};

		$http.post(url, data).then(() => {
			this.listController.favorites.splice(this.index, 1);
		});
	};

	this.updateQty = (qty: number, productId: number) => {
		this.isInProgress = true;
		Cart.update(qty, productId)
			.then((response) => {
				if (response.data.cart && response.data.cart.items[productId]) {
					this.item.cart_qty =
						response.data.cart.items[productId].qty;
				} else {
					this.item.cart_qty = 0;
				}
			})
			.finally(() => {
				this.isInProgress = false;
			});
	};

	this.updateSelection = () => {
		this.listController.toggleSelected(this.index);
	};
}
