import angular from 'angular';
import template from './favorites-list.component.html';

export const FavoritesList: ng.IComponentOptions = {
	template,
	controller: class FavoritesListController {
		static $inject = ['Alerts', 'Cart', 'Favorites'];
		public isRemovingSelectedFromFavorites = false;
		public selectAll = false;
		public selected: boolean[] = [];
		public isSignedIn: boolean;
		public isLoading: boolean;
		public favorites: any[];

		// eslint-disable-next-line no-useless-constructor
		constructor(
			private Alerts: any,
			private Cart: any,
			private Favorites: any
		) {}

		$onInit() {
			this.getFavorites();
		}

		addSelectedToCart() {
			this.isLoading = true;
			const qty = 1;
			const products = {};

			angular.forEach(this.favorites, (product) => {
				const id = product.product_id;
				const isProductAvailable =
					!product.available_qty ||
					product.available_qty > product.cart_qty;

				if (product.isChecked) {
					if (isProductAvailable) {
						products[id] = qty;
					} else {
						this.Alerts.warning(
							`There is no more available ${product.description} to add to your cart.`
						);
					}
				}
			});

			this.Cart.addItems(products)
				.then(() => {
					this.selectAll = false;
					this.getFavorites();
				})
				.catch((reject) => {
					console.error(reject);
				});
		}

		getFavorites() {
			this.isLoading = true;
			this.Favorites.fillDetails().then((response) => {
				this.favorites = response.data.favorites;
				this.isLoading = false;
			});
		}

		removeSelectedFromFavorites() {
			this.isRemovingSelectedFromFavorites = true;
			const selectedFavorites = this.favorites.filter(
				(favorite) => favorite.isChecked
			);
			let numToRemove = selectedFavorites.length;

			selectedFavorites.forEach((favorite) => {
				this.Favorites.remove(favorite.product_id).then(() => {
					numToRemove = numToRemove - 1;
					if (numToRemove === 0) {
						this.getFavorites();
						this.isRemovingSelectedFromFavorites = false;
					}
				});
			});
			this.selectAll = false;
		}

		toggleSelectAll() {
			for (const item of this.favorites) {
				item.isChecked = this.selectAll;
			}
			const newSelected = new Array(this.favorites.length);
			newSelected.fill(this.selectAll);
			this.selected = newSelected;
		}

		toggleSelected(index: number) {
			this.selected[index] = !this.selected[index];
		}
	},
};
