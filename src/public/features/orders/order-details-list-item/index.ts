import template from './index.template.html';

export const OrderDetailsListItemComponent: ng.IComponentOptions = {
	bindings: {
		isPending: '<',
		item: '<',
		status: '<',
		removeItem: '&',
	},
	controller: class Controller {
		static $inject: string[] = ['Cart', 'Favorites', 'User'];
		public isConfirmingDelete: boolean;
		isReturningItem: boolean;
		isSubmittingReturn: boolean;
		item: {
			favorite: boolean;
			purch_id: number;
			product_id: number;
			qty: number;
		};
		notes: string;
		reason: string;
		isTogglingFavorite: boolean;
		removeItem: any;
		isRemoving: boolean;

		// eslint-disable-next-line no-useless-constructor
		constructor(
			private Cart: any,
			private Favorites: any,
			private User: any
		) {}

		onClickReturnItem() {
			this.isReturningItem = true;
		}

		onClickSubmitReturn() {
			this.isSubmittingReturn = true;
			const params = [
				this.item.purch_id,
				this.notes,
				this.reason,
				this.item.qty,
			];

			this.User.addRma(...params).then(() => {
				this.isSubmittingReturn = false;
				this.isReturningItem = false;
			});
		}

		remove() {
			this.isRemoving = true;
			this.removeItem({ productId: this.item.product_id });
		}

		toggleFavorite() {
			this.isTogglingFavorite = true;
			if (this.item.favorite) {
				this.Favorites.remove(this.item.product_id).then(() => {
					this.updateFavorite();
				});
			} else {
				this.Favorites.add(this.item.product_id).then(() => {
					this.updateFavorite();
				});
			}
		}

		updateFavorite() {
			this.item.favorite = !this.item.favorite;
			this.isTogglingFavorite = false;
		}
	},
	template,
};
