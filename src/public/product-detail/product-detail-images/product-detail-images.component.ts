import template from './product-detail-images.component.html';

export const ProductDetailImages: ng.IComponentOptions = {
	template,
	bindings: {
		description: '<',
		images: '<',
	},
	controller,
};

function controller() {
	const vm = this;
	this.placeholder =
		'/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
	vm.$onInit = onInit;

	/**
	 */
	function onInit() {
		vm.images = convertImages(vm.images);
	}

	/**
	 * @function convertImages
	 * @param {Object} images Object containing keyed image objects.
	 * @return {Array} Array containing image objects.
	 */
	function convertImages(images) {
		return Object.values(images);
	}
}
