import angular from 'angular';
import template from './punchout-suppliers.html';

(function () {
	'use strict';

	angular.module('vfApp').component('punchoutSuppliers', {
		controller: SupplierListController,
		template,
	});

	SupplierListController.$inject = ['Punchout', 'User', 'Utils'];

	/**
	 * @namespace SupplierListController
	 * @param {Object} Punchout VendorFuel service
	 * @param {Object} User     VendorFuel service
	 * @param {Object} Utils    VendorFuel service
	 */
	function SupplierListController(Punchout, User, Utils) {
		const vm = this;
		vm.$onInit = onInit;
		vm.getSuppliers = getSuppliers;

		/**
		 */
		function onInit() {
			checkShippingProfile();
		}

		/**
		 */
		function checkShippingProfile() {
			vm.isLoading = true;
			vm.loadingText = 'Checking shipping profiles...';
			User.getProfiles()
				.then((response) => response.data)
				.then((data) => {
					if (Object.entries(data.shipping_addresses).length) {
						vm.hasShippingProfiles = true;
						getSuppliers();
					} else {
						vm.hasNoShippingProfiles = true;
						vm.isLoading = false;
					}
				});
		}

		/**
		 */
		function getSuppliers() {
			vm.loadingText = 'Getting Punchout suppliers...';
			vm.isLoading = true;
			Punchout.listSuppliers()
				.then((response) => response.data)
				.then((data) => {
					vm.suppliers = data.suppliers;
					vm.isLoading = false;
				});
		}

		this.punchoutToPartner = (supplierId: number) => {
			const returnUrl = Utils.getPageUrl('punchout-return');
			this.isLoadingPunchout = true;
			Punchout.supplierRequest(supplierId, returnUrl);
		};
	}
})();
