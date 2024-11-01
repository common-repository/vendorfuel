import angular from 'angular';
import template from './cart-split-checkout.component.html';

interface Item {
	description: string;
	included: boolean;
	item_total: number;
	images: {
		thumb_url: string;
	}[];
	price: number;
	product_id: number;
	qty: number;
	sku: string;
	mfg_part_num: string;
}

export const CartSplitCheckoutComponent: ng.IComponentOptions = {
	template,
	controller: class CartSplitCheckoutController {
		static $inject: string[] = ['Cart', 'Utils'];

		private allToggle = false;
		private modal: JQuery;
		private numItems: number;
		public includes: number;
		public items: Item[];
		public qtyUpdateIsHidden: boolean[] = [];
		public updatingQty: boolean[] = [];
		public updated: boolean;

		constructor(private Cart: any, private Utils: any) {
			this.includes = 0;
			this.modal = jQuery('#splitCheckoutModal');
		}

		handleChange(index: number) {
			this.qtyUpdateIsHidden[index] = false;
			this.updatingQty[index] = true;
			this.updated = false;
		}

		changeIncludes(item) {
			item.included = !item.included;
			if (item.included) {
				this.includes++;
				if (this.includes === this.numItems && !this.allToggle) {
					this.allToggle = true;
				}
			} else {
				this.includes--;
				if (!this.includes && this.allToggle) {
					this.allToggle = false;
				}
			}
		}

		toggleAll(): void {
			this.allToggle = !this.allToggle;
			this.includes = 0;

			if (this.allToggle) {
				this.includes = this.numItems;
			}

			angular.forEach(this.items, (value, key) => {
				this.items[key].included = this.allToggle;
			});
		}

		checkUpdating() {
			for (let i = 0; i < this.updatingQty.length; i++) {
				if (this.updatingQty[i]) {
					return true;
				}
			}
		}

		updateQty(item: Item, index: number) {
			this.updatingQty[index] = true;
			this.updated = false;
			item.item_total = item.qty * item.price;
			this.updated = true;
			this.qtyUpdateIsHidden[index] = true;
			this.updatingQty[index] = false;
		}

		openSplitCartModal() {
			this.modal.modal('show');
			this.items = angular.copy(this.Cart.details.items);
			this.numItems = Object.keys(this.items).length;
		}

		cancel() {
			this.modal.modal('hide');
			this.reset();
		}

		reset() {
			this.qtyUpdateIsHidden = [];
			this.updatingQty = [];
		}

		splitCheckout() {
			const itemsToCheckout = {};
			angular.forEach(this.items, (item) => {
				if (item.included) {
					itemsToCheckout[item.product_id] = item.qty;
				}
			});
			this.Cart.partialCheckout(itemsToCheckout).then(() => {
				this.Utils.goToPage(this.Utils.getPageUrl('checkout'));
			});
		}
	},
};
