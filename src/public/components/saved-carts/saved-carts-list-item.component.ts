/**
 * @namespace savedCartsListItem
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('vfSavedCartsListItem', {
		templateUrl: 'vfSavedCartsListItem.html',
		bindings: {
			cart: '<',
			onDelete: '&',
		},
		controller: SavedCartsListItemController,
	});

	/**
	 */
	function SavedCartsListItemController() {
		const vm = this;

		vm.getCartUrl = getCartUrl;

		/**
		 * @function delete
		 */
		vm.delete = () => {
			vm.onDelete({
				cart: vm.cart,
			});
		};

		/**
		 * @function getSavedCarts
		 * @param {number} id Cart id
		 * @return {string} URL
		 */
		function getCartUrl(id) {
			return `/saved-cart/?id=${id}`;
		}
	}
})();
