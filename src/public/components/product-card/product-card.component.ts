/**
 * Product Card Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfProductCard', {
		bindings: {
			productId: '<',
		},
		templateUrl: 'vfProductCard.html',
		controller: ProductController,
	});

	ProductController.$inject = ['Cart', 'Products', 'User', 'Utils'];

	/**
	 * @namespace ProductController
	 * @param {Object} Cart     VendorFuel service
	 * @param {Object} Products VendorFuel service
	 * @param {Object} User     VendorFuel service
	 * @param {Object} Utils    VendorFuel service
	 * @memberof Components
	 */
	function ProductController(Cart, Products, User, Utils) {
		const vm = this;
		vm.$onInit = onInit;
		vm.errors = [];
		vm.isAddingToCart = false;
		vm.isLoading = true;
		vm.isSignedIn = User.isAuthed && !User.isGuest;
		vm.onClickAddToCart = onClickAddToCart;
		vm.onClickFavorites = onClickFavorites;
		vm.productSlug = localized.settings.general.product_slug || 'products';

		/**
		 * @name onInit
		 * @memberof Components.ProductController
		 */
		function onInit() {
			if (vm.productId && Number.isInteger(Number(vm.productId))) {
				getProduct();
			} else {
				vm.errors.push('Missing or invalid product ID in shortcode.');
				vm.isLoading = false;
			}
		}

		/**
		 * @name onClickAddToCart
		 * @memberof Components.ProductController
		 */
		function onClickAddToCart() {
			const productId = vm.productId;
			const qty = 1;
			vm.isAddingToCart = true;

			Cart.add(productId, qty)
				.then((resolve) => resolve.data)
				.then(
					(data) => {
						if (data.errors.length === 0) {
							vm.product.cart_qty += qty;
							vm.isAddingToCart = false;
						} else {
							data.errors.forEach((error) =>
								vm.errors.push(error)
							);
						}
					},
					(reject) => {
						vm.isError = true;
						console.error('Rejected:', reject.data);
					}
				);
		}

		/**
		 * @name onClickFavorites
		 * @memberof Components.ProductController
		 */
		function onClickFavorites() {
			const params = {
				product_id: vm.productId,
			};

			if (User.isAuthed) {
				vm.isTogglingFavorite = true;
				if (!vm.isFavorite) {
					Cart.addFavorite(params).then(() => {
						vm.isFavorite = true;
						vm.isTogglingFavorite = false;
					});
				} else {
					Cart.removeFavorite(params).then(() => {
						vm.isFavorite = false;
						vm.isTogglingFavorite = false;
					});
				}
			}
		}

		/**
		 * @name getBrandName
		 * @param {Object} product Product data.
		 * @return {string} Brand name or manufacturer.
		 * @memberof Components.ProductController
		 */
		function getBrandName(product) {
			return product.brand_name
				? product.brand_name
				: product.manufacturer;
		}

		/**
		 * @name getBrandLink
		 * @param {Object} product Product data.
		 * @return {string} URL to brand or manufacturer.
		 * @memberof Components.ProductController
		 */
		function getBrandLink(product) {
			const catalogUrl = Utils.getPageUrl('catalog');
			return product.brand_name
				? `${catalogUrl}?brand_name=${product.brand_name}`
				: `${catalogUrl}?manufacturer=${product.manufacturer}`;
		}

		/**
		 * @name getProduct
		 * @memberof Components.ProductController
		 */
		function getProduct() {
			const params = {
				product_id: vm.productId,
			};

			Products.get(params)
				.$promise.then((product) => {
					if (product.errors.length === 0) {
						vm.brandName = getBrandName(product);
						vm.brandLink = getBrandLink(product);
						vm.price = product.price;
						vm.product = product;
						vm.isFavorite = vm.product.favorite || false;
						vm.url = `/${vm.productSlug}/${vm.product.slug}`;
						vm.imageSrc = getImageSrc(product.images);
					} else {
						product.errors.forEach((error) =>
							vm.errors.push(error)
						);
					}
				})
				.catch((reject) => {
					console.error('reject', reject);
				})
				.finally(function () {
					vm.isLoading = false;
				});
		}

		/**
		 * @param {Object} data Image data
		 * @return {string} Image source
		 */
		function getImageSrc(data) {
			if (Object.values(data).length) {
				return Object.values(data)[0].small_url;
			}
			return '/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
		}
	}
})();
