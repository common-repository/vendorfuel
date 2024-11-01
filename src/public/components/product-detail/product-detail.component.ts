import template from './product-detail.component.html';
declare const angular: ng.IAngularStatic;

/**
 * Product Detail Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('productDetail', {
		bindings: {
			productId: '<',
		},
		controller: ProductController,
		template,
	});

	ProductController.$inject = [
		'$location',
		'Alerts',
		'Analytics',
		'Cart',
		'Products',
		'User',
		'Utils',
	];

	/**
	 * @namespace ProductController
	 * @param {Object} $location
	 * @param {Object} Alerts    VendorFuel service.
	 * @param {Object} Analytics VendorFuel service.
	 * @param {Object} Cart      VendorFuel service.
	 * @param {Object} Products  VendorFuel service.
	 * @param {Object} User      VendorFuel service.
	 * @param {Object} Utils     VendorFuel service.
	 * @memberof Components
	 */
	function ProductController(
		$location,
		Alerts,
		Analytics,
		Cart,
		Products,
		User,
		Utils
	) {
		(window as any).prerenderReady = false;

		const vm = this;
		this.settings = localized.settings.general;
		this.warningIcon = `${localized.dir.url}public/images/warning.svg`;
		vm.$onInit = $onInit;
		vm.addToCart = addToCart;
		vm.getReviewTotal = getReviewTotal;

		/**
		 */
		function $onInit() {
			vm.addQty = 1;
			vm.cachedAddQty = vm.addQty;
			vm.defaultImg = {};
			vm.hasDisabledGuests =
				localized.settings.store.options['Disable Guests'];
			vm.isLoading = true;
			vm.isSignedIn = User.isAuthed && User.email;
			vm.pageUrls = {
				contact: Utils.getPageUrl('contact'),
				login: Utils.getPageUrl('login', {
					redirect_to: $location.path(),
				}),
				register: Utils.getPageUrl('register'),
			};
			vm.productUrl = document.URL;

			if (User.isAuthed && !User.isGuest && User.punchoutOnly === 1) {
				Utils.goToPage(Utils.getPageUrl('welcome'));
			}
			if (vm.productId) {
				getProduct(vm.productId);
			} else {
				Alerts.warning('Missing product ID.');
				vm.isLoading = false;
			}
		}

		/**
		 * Prevent user from entering non-digit characters.
		 *
		 * @param {number} e
		 */
		this.onKeydown = (e: KeyboardEvent) => {
			// Prevent quantity from becoming larger than 1000 or the product quantity
			const max = vm.product.available_qty || 1000;
			if (vm.addQty) {
				const newAddQty = Number(vm.addQty.toString() + e.key);
				if (newAddQty > max) {
					e.preventDefault();
					// Instead of just preventing user input, set the addQty to the max and then display a message to the user.
					vm.addQty = max;
					vm.hasMaxQty = true;
				}
			}

			// Prevent user from entering non-digit characters.
			if (
				e.key !== 'Backspace' &&
				e.key !== 'ArrowUp' &&
				e.key !== 'ArrowDown' &&
				isNaN(Number(e.key))
			) {
				e.preventDefault();
			}
		};

		/**
		 * Gets the product data.
		 *
		 * @param {number} productId Product ID.
		 * @memberof Components.ProductController
		 */
		function getProduct(productId) {
			const params = {
				product_id: productId,
			};

			Products.get(params).$promise.then((product) => {
				if (!product.warnings.length && !product.errors.length) {
					const { sku, images, price, description, uom } = product;
					Products.appendRecent({
						product_id: productId,
						sku,
						images,
						price,
						description,
						uom,
					});
					vm.breadcrumb = product.category_breadcrumb;
					vm.brandName = getBrandName(product);
					vm.brandLink = getBrandLink(product);
					vm.documents = product.documents;
					vm.prop65Warning = product.prop65
						? getProp65Warning(product.prop65.warning)
						: null;
					let imgCount = 0;
					angular.forEach(product.images, function (data, index) {
						if (imgCount === 0) {
							vm.defaultImg = product.images[index];
						}
						if (data.default === 1) {
							vm.defaultImg = product.images[index];
						}

						vm.schemaImg = vm.defaultImg.med_url;
						imgCount += 1;
					});
					vm.product = product;
				}
				vm.isLoading = false;
			});
		}

		/**
		 * Gets the brand name or manufacturer name.
		 *
		 * @param {Object} product Product
		 * @memberof Components.ProductController
		 * @return {string} Brand name.
		 */
		function getBrandName(product) {
			return product.brand_name
				? product.brand_name
				: product.manufacturer;
		}

		/**
		 * Gets the link to the brand or manufacturer.
		 *
		 * @param {Object} product Product
		 * @memberof Components.ProductController
		 * @return {string} URL
		 */
		function getBrandLink(product) {
			return product.brand_name
				? `/catalog?brand_name=${product.brand_name}`
				: `/catalog?manufacturer=${product.manufacturer}`;
		}

		/**
		 * @param {string} warning Original warning.
		 * @return {string} Formatted warning.
		 */
		function getProp65Warning(warning) {
			warning = warning.replace(/(^warning:)/gi, '').trim(); // Strip 'Warning' since Cal law needs it bold.
			warning = warning.replace(
				/(www.p65warnings.ca.gov)/gi,
				'<a href="https://$&" class="alert-link" target="_blank">$&</a>'
			);
			return warning;
		}

		/**
		 * Gets the review count from the Product Detail Reviews component for the page metadata.
		 *
		 * @param {number} total Number of reviews
		 */
		function getReviewTotal(total) {
			vm.reviewCount = total;
			Analytics.viewItem(vm.product);
			(window as any).prerenderReady = true;
		}

		/**
		 * @name addToCart
		 * @param {Object} product Product
		 * @param {Object} $event  jQuery click event.
		 * @memberof Components.ProductController
		 */
		function addToCart(product, $event) {
			const btn = jQuery($event.target);
			btn.data('original-text', btn.html())
				.html(btn.data('loading-text'))
				.prop('disabled', true);
			let productId = vm.productId;
			let qty = vm.addQty;

			/* If product being added to cart isn't the main product (i.e. Recommended) */
			if (product.product_id !== vm.productId) {
				productId = product.product_id;
				qty = 1;
			}

			Cart.add(productId, qty).then(function () {
				vm.product.cart_qty += parseInt(qty);
				btn.html(btn.data('original-text')).prop('disabled', false);
			});
		}
	}
})();
