import angular from 'angular';
import template from './checkout-additional-fields.html';

/**
 * Checkout Additional Fields Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('checkoutAdditionalFields', {
		bindings: {
			extraFields: '=',
		},
		controller: AdditionalFieldsController,
		require: {
			checkoutCtrl: '^vfCheckout',
		},
		template,
	});

	/**
	 */
	function AdditionalFieldsController() {
		const vm = this;
		vm.onClickReview = onClickReview;
		vm.$onInit = $onInit;

		/**
		 */
		function $onInit() {
			vm.customFields = vm.checkoutCtrl.customFields;
			vm.fields = {};
		}

		/**
		 * @name onClickReview
		 * @memberof Components.onClickReview
		 */
		function onClickReview() {
			vm.checkoutCtrl.isReadyToConfirm = true;
			vm.checkoutCtrl.isExtraFieldsComplete = true;
			setTimeout(function () {
				vm.checkoutCtrl.showTab('review');
			}, 500);
		}
	}
})();
