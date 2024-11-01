import template from './saved-cart.component.html';

/**
 * @namespace vfSavedCart
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfSavedCart', {
		template,
		controller: SavedCartController,
	});

	SavedCartController.$inject = ['$location', 'Cart', 'User', 'Utils'];

	/**
	 * @param {Object} $location
	 * @param {Object} Cart      VendorFuel service
	 * @param {Object} User      VendorFuel service
	 * @param {Object} Utils     VendorFuel service
	 */
	function SavedCartController($location, Cart, User, Utils) {
		const vm = this;
		vm.addSelectedToCart = addSelectedToCart;
		vm.deleteItem = deleteItem;
		vm.deleteSelected = deleteSelected;
		vm.toggleSelectAll = toggleSelectAll;
		vm.selectedItems = selectedItems;
		vm.selectedItemsForAdding = selectedItemsForAdding;
		vm.$onInit = $onInit;

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.cartId = Utils.urlParser.param('id');
			vm.isAddingSelectedToCart = false;
			vm.isAllSelected = false;
			vm.isCartLoaded = false;
			vm.isLoading = true;
			vm.isSignedIn = User.isAuthed && User.email;
			vm.items = [];
			vm.pageUrls = {
				cart: Utils.getPageUrl('cart'),
				login: Utils.getPageUrl('login', {
					redirect_to: $location.path(),
				}),
				register: Utils.getPageUrl('register'),
				savedCarts: Utils.getPageUrl('saved-carts'),
			};
			vm.productSlug =
				localized.settings.general.product_slug || 'products';

			if (!vm.cartId) {
				Utils.goToPage(Utils.getPageUrl('saved-carts'));
			}
		}

		/**
		 * Uses the digest cycle to check the real cart for any items that might the same as in the saved cart.
		 * That way users can't add more items to the cart than what's actually available.
		 */
		vm.$doCheck = () => {
			if (!vm.isCartLoaded && vm.isSignedIn && vm.cartId) {
				if (angular.isObject(Cart.details) && !vm.currentCartItems) {
					vm.currentCartItems = Cart.details.items;
					getSavedCart(vm.cartId);
				} else if (
					angular.isUndefined(Cart.details) &&
					!vm.currentCartItems
				) {
					vm.currentCartItems = { 0: {} };
					getSavedCart(vm.cartId);
				}
			}
		};

		/**
		 * @return {boolean} If item is selected
		 */
		function selectedItems() {
			return vm.items.filter(function (item) {
				return item.isSelected;
			}).length;
		}

		/**
		 * @return {number} Selected items
		 */
		function selectedItemsForAdding() {
			return vm.items.filter(function (item) {
				return item.isSelected && item.isActive;
			}).length;
		}

		/**
		 */
		function addSelectedToCart() {
			vm.items.forEach((item) => {
				if (item.isSelected) {
					vm.isAddingSelectedToCart = true;
					const index = vm.items.indexOf(item);
					if (index >= 0) {
						Cart.add(item.id, item.savedCartQty)
							.then((response) => {
								if (response.data.errors.length === 0) {
									item.cartQty =
										response.data.cart.items[item.id].qty;
								} else {
									vm.errors = response.data.errors;
									vm.isAddingSelectedToCart = false;
								}
							})
							.finally(function () {
								vm.isAddingSelectedToCart = false;
							});
					}
				}
			});
		}

		this.deleteCart = () => {
			this.isDeleting = true;
			Cart.deleteSaved(vm.cartId).then(() => {
				Utils.goToPage(vm.pageUrls.savedCarts);
				this.isDeleting = false;
			});
		};

		/**
		 * @function deleteSelected
		 */
		function deleteSelected() {
			vm.items.forEach((item) => {
				if (item.isSelected) {
					const index = vm.items.indexOf(item);
					if (index >= 0) {
						vm.isLoading = true;
						Cart.removeSavedItem(vm.cartId, item.id)
							.then(
								(response) => {
									if (response.data.errors.length === 0) {
										vm.items.splice(index, 1);
									} else {
										console.error(response.data.errors);
									}
								},
								function (error) {
									console.error(error);
								}
							)
							.finally(() => {
								vm.isLoading = false;
							});
					}
				}
			});
		}

		/**
		 * @function deleteItem
		 * @param {Object} item Item
		 */
		function deleteItem(item) {
			const index = vm.items.indexOf(item);
			if (index >= 0) {
				vm.isLoading = true;
				Cart.removeSavedItem(vm.cartId, item.id)
					.then(
						(response) => {
							if (response.data.errors.length === 0) {
								vm.items.splice(index, 1);
							} else {
								console.error(response.data.errors);
							}
						},
						function (error) {
							console.error(error);
						}
					)
					.finally(() => {
						vm.isLoading = false;
					});
			}
		}

		/**
		 * @function getSavedCart
		 * @param {number} id Saved cart ID
		 */
		function getSavedCart(id) {
			Cart.getSaved(id).then((cart) => {
				if (cart.items) {
					vm.cartTitle = cart.cart_title;
					vm.subtotal = cart.subtotal;
					const items = [];

					/* Convert returned object into an cleaned array. */
					angular.forEach(cart.items, (value) => {
						const item = {
							hasStockQty: Number.isFinite(value.available_qty),
							isActive: value.status === 'active',
							isFavorite: value.favorite,
							id: value.product_id,
							image: getProductImage(value.images),
							itemTotal: value.item_total,
							price: value.price,
							qty: value.qty,
							cartQty: getRealCartQty(value.product_id),
							savedCartQty: getSavedCartQty(value),
							sku: value.sku,
							slug: value.slug,
							status: value.status,
							stockQty: value.available_qty,
							title: value.description,
							uom: value.uom,
						};

						items.push(item);
					});
					vm.items = items;
					vm.isCartLoaded = true;
				}
				vm.breadcrumb = setBreadcrumb();
				vm.isLoading = false;
			});
		}

		/**
		 * @param {number} id Product ID
		 * @return {number} Current quantity of product in cart.
		 */
		function getRealCartQty(id) {
			return vm.currentCartItems[id] ? vm.currentCartItems[id].qty : 0;
		}

		/**
		 * @param {Object} item Product
		 * @return {number} Quantity in saved cart
		 */
		function getSavedCartQty(item) {
			const savedCartQty = item.qty;
			return savedCartQty;
		}

		/**
		 * @function getProductImage
		 * @param {Object} images Dictonary-style array containing the image info.
		 * @return {string} Image URL
		 */
		function getProductImage(images) {
			return angular.isObject(images) && Object.keys(images).length > 0
				? images[Object.keys(images)[0]].thumb_url
				: null;
		}

		/**
		 * @return {Array} Breadcrumb
		 */
		function setBreadcrumb() {
			const breadcrumb = [
				{
					title: 'Home',
					link: '/',
				},
				{
					title: 'Saved Carts',
					link: vm.pageUrls.savedCarts,
				},
			];
			if (vm.cartTitle) {
				breadcrumb.push({
					title: vm.cartTitle,
					link: `/saved-cart?id=${vm.cartId}`,
				});
			} else {
				breadcrumb.push({
					title: 'Empty Saved Cart',
					link: `/saved-cart?id=${vm.cartId}`,
				});
			}
			return breadcrumb;
		}

		/**
		 * @function toggleSelectAll
		 * @param {boolean} isAllSelected True (checked) if all items are supposed to be selected.
		 */
		function toggleSelectAll(isAllSelected) {
			vm.items.forEach((item) => (item.isSelected = isAllSelected));
		}
	}
})();
