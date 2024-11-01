import angular from 'angular';
import template from './catalog-product-list.component.html';

/**
 * @namespace catalogProductList
 * @memberof Components
 * @param {number} catalogId Id number of specific category, collection or manufacturer.
 * @param {string} idType    Expects 'CATEGORY', 'COLLECTION' or 'MANUFACTURER'
 */

(function () {
	'use strict';

	angular.module('vfApp').component('catalogProductList', {
		template,
		bindings: {
			catalogId: '<',
			idType: '<',
		},
		controller: CatalogController,
	});

	CatalogController.$inject = [
		'$location',
		'$rootScope',
		'User',
		'Utils',
		'catalogService',
	];

	/**
	 * @param {Object} $location      Angular service
	 * @param {Object} $rootScope     Angular service
	 * @param {Object} User           VendorFuel service
	 * @param {Object} Utils          VendorFuel service
	 * @param {Object} catalogService Catalog service
	 */
	function CatalogController(
		$location,
		$rootScope,
		User,
		Utils,
		catalogService
	) {
		window.prerenderReady = false;
		this.hasAPIKey = localized.settings.general.api_key;

		const vm = this;
		vm.hits = [];
		vm.isLoading = true;
		vm.isSignedIn = User.isAuthed && User.email;
		vm.viewAs = $location.search().viewas
			? $location.search().viewas
			: 'grid';

		vm.$onInit = () => {
			if (this.hasAPIKey) {
				this.setAvailableStock();
				checkPunchout();

				vm.pageUrls = {
					catalog: Utils.getPageUrl('catalog'),
				};
				catalogService.setCatalogId(vm.catalogId, vm.idType);
				vm.currentPage = catalogService.getCurrentPage();

				return getCatalog().then((catalog) => {
					$rootScope.$emit('catalog.data:init', catalog);
				});
			}
		};

		$rootScope.$on('catalog.params:changes', () => {
			vm.isLoading = true;
			return getCatalog();
		});

		/**
		 * Checks User Punchout status and redirects if necessary.
		 */
		function checkPunchout() {
			if (User.punchoutOnly && !User.mixedPunchout) {
				Utils.goToPage(Utils.getPageUrl('welcome'));
			}
		}

		/**
		 * @param {Object} filters Filters
		 * @return {boolean} If any filters are active
		 */
		function getActiveFilters(filters) {
			return Object.values(filters).some((filter) => filter);
		}

		/**
		 * @return {Array} Products
		 */
		function getCatalog() {
			return catalogService.getCatalog().then((catalog) => {
				if (catalog && catalog.hits) {
					vm.hits = catalog.hits;
				}
				vm.query = $location.search().q;
				vm.hasActiveFilters = getActiveFilters(catalog.filters);
				vm.isCategory = catalog.category ? true : false;
				vm.category = catalog.category;
				vm.isLoading = false;
				window.prerenderReady = true;
				$rootScope.$emit('catalog.data:changes');
				return vm.hits;
			});
		}

		this.setAvailableStock = () => {
			const excludeSoldOut = localized.settings.general.excludeSoldOut;
			/* If Settings > Plugin > Catalog Filters > Exclude sold out items by default is checked, the available_stock parameter will be added, triggering the filter. This only happens the first time the catalog loads. */
			if (excludeSoldOut) {
				$location.search('available_stock', true);
			}
		};

		vm.toggleView = () => {
			vm.viewAs = vm.viewAs === 'grid' ? 'list' : 'grid';
			$location.search('viewas', vm.viewAs);
		};
	}
})();
