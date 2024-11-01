import template from './saved-carts.component.html';

(function () {
	'use strict';

	angular.module('vfApp').component('vfSavedCarts', {
		template,
		controller: SavedCartsController,
	});

	SavedCartsController.$inject = ['$location', 'Cart', 'User', 'Utils'];

	/**
	 * @param {Object} $location
	 * @param {Object} Cart      VendorFuel service
	 * @param {Object} User      VendorFuel service
	 * @param {Object} Utils     VendorFuel service
	 */
	function SavedCartsController($location, Cart, User, Utils) {
		const vm = this;
		vm.deleteCart = deleteCart;

		vm.$onInit = () => {
			vm.breadcrumb = [
				{
					title: 'Home',
					link: '/',
				},
				{
					title: 'Saved Carts',
					link: '/saved-carts',
				},
			];
			vm.isSignedIn = User.isAuthed && User.email;
			vm.isLoading = true;
			vm.pageUrls = {
				login: Utils.getPageUrl('login', {
					redirect_to: $location.path(),
				}),
				register: Utils.getPageUrl('register'),
			};
			if (vm.isSignedIn) {
				getSavedCarts();
			}
		};

		/**
		 * @function getSavedCarts
		 */
		function getSavedCarts() {
			Cart.getSavedList().then((list) => {
				const carts = [];
				angular.forEach(list, (value) => {
					const cart = {
						id: value.saved_cart_id,
						title: value.cart_title,
						numItems: value.num_items,
					};
					carts.push(cart);
				});
				vm.carts = carts;
				vm.isLoading = false;
			});
		}

		/**
		 * @function deleteCart
		 * @param {Object} cart Cart
		 */
		function deleteCart(cart) {
			const index = vm.carts.indexOf(cart);
			if (index >= 0) {
				vm.isLoading = true;
				Cart.deleteSaved(cart.id).then(
					() => {
						vm.carts.splice(index, 1);
						vm.isLoading = false;
					},
					function (error) {
						console.error(error);
					}
				);
			}
		}
	}
})();
