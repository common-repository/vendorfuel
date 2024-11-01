import template from './product-related.component.html';

export const ProductRelatedComponent: ng.IComponentOptions = {
	bindings: {
		products: '<',
	},
	template,
	controller: class ProductRelatedController {
		private max = 100;
		public limit: number;
		public min = 5;
		public viewAs = 'grid';
		title: string;

		constructor() {
			this.title =
				localized.settings.general.relatedProductsTitle ||
				'Related products';
		}
		$onInit() {
			this.limit = this.min;
		}

		toggleShowMore() {
			this.limit = this.limit === this.min ? this.max : this.min;
		}
	},
};
