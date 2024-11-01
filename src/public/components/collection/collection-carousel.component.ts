(function () {
	'use strict';

	angular.module('vfApp').component('collectionCarousel', {
		bindings: {
			collectionId: '<',
		},
		templateUrl: 'collectionCarousel.html',
		controller: FeaturedProductsController,
	});

	FeaturedProductsController.$inject = ['Collections'];

	/**
	 * @param {Object} Collections VendorFuel service
	 */
	function FeaturedProductsController(Collections) {
		const vm = this;
		vm.$onInit = $onInit;

		/**
		 * Initialization
		 */
		function $onInit() {
			getProducts();
		}

		/**
		 * @param {Array} products Array of products.
		 * @return {Array} Products grouped together.
		 */
		function getSlides(products) {
			const slides = [];
			const productsPerSlide = 4;
			const numOfSlides = Math.ceil(products.length / productsPerSlide);
			const tempItems = products;
			for (let i = 0; i < numOfSlides; i++) {
				const slide = tempItems.slice(0, productsPerSlide);
				slides.push(slide);
				tempItems.splice(0, productsPerSlide);
			}
			return slides;
		}

		/**
		 * Get the collection products.
		 */
		function getProducts() {
			vm.isLoading = true;
			const { collectionId } = vm;
			const placeholder =
				'/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
			const productSlug =
				localized.settings.general.product_slug || 'products';

			const params = {
				col_id: collectionId,
				rpp: 100,
			};
			Collections.viewCollection(params).then((data) => {
				vm.products = data.collection.products.data.map((product) => {
					return {
						imgSrc: product.image
							? product.image.small_url
							: placeholder,
						name: product.description,
						price: product.price,
						uomDesc: product.uomdesc,
						uomQty: product.uomqty,
						url: `/${productSlug}/${product.slug}`,
					};
				});
				vm.slides = getSlides(vm.products);
				vm.isLoading = false;
			});
		}
	}
})();
