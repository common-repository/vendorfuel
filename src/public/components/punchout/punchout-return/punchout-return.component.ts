import angular from 'angular';
import template from './punchout-return.component.html';
declare const params: { 'cxml-urlencoded': string; order_id: string };
/**
 * Punchout Return Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('punchoutReturn', {
		controller: PunchoutController,
		template,
	});

	PunchoutController.$inject = ['$timeout', 'Punchout', 'Utils'];

	function PunchoutController(
		$timeout: ng.ITimeoutService,
		Punchout: any,
		Utils: any
	) {
		this.hasAPIKey = localized.settings.general.api_key;
		const vm = this;
		vm.$onInit = onInit;

		const beforeUnloadListener = (event) => {
			event.preventDefault();
			return (event.returnValue =
				'Are you sure you want to before cart is filled?');
		};

		function onInit() {
			if (this.hasAPIKey) {
				const { 'cxml-urlencoded': returnedCXML, order_id: orderId } =
					params;

				addEventListener('beforeunload', beforeUnloadListener, {
					capture: true,
				});

				Punchout.supplierReturn(returnedCXML, orderId).then(
					(response) => {
						removeEventListener(
							'beforeunload',
							beforeUnloadListener,
							{ capture: true }
						);
						if (
							response.data.errors.length ||
							response.data.warnings.length ||
							response.data.notifications.length
						) {
							$timeout(() => {
								this.redirect(orderId);
							}, 5000);
						} else {
							this.redirect(orderId);
						}
					}
				);
			}
		}

		this.redirect = (orderId?: number) => {
			if (!orderId) {
				window.location.href = Utils.getPageUrl('cart');
			} else {
				top.location.href = `${Utils.getPageUrl(
					'group-orders'
				)}?id=${orderId}&pending`;
			}
		};
	}
})();
