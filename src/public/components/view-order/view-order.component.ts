import angular from 'angular';
import template from './view-order.component.html';

/**
 * View Order Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('viewOrder', {
		controller: OrderController,
		template,
	});

	OrderController.$inject = ['$location', 'User', 'Utils'];

	/**
	 * @param {Object} $location
	 * @param {Object} User      VendorFuel service
	 * @param {Object} Utils     VendorFuel service
	 */
	function OrderController($location, User, Utils) {
		this.hasPermission = User.isAuthed && (User.email || User.isGuest);
		this.orderId = Utils.urlParser.param('id');

		this.$onInit = () => {
			this.pageUrls = {
				login: Utils.getPageUrl('login', {
					redirect_to: $location.path(),
				}),
				orders: Utils.getPageUrl('orders'),
				register: Utils.getPageUrl('register'),
			};
			if (this.hasPermission && this.orderId) {
				this.getOrder();
			}
		};

		this.getOrder = () => {
			this.isLoading = true;

			User.viewOrder(this.orderId)
				.then((response) => response.data)
				.then((data) => {
					this.order = data.order;
					this.isLoading = false;
				});
		};
	}
})();
