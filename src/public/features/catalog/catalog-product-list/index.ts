import template from './index.template.html';

export const CatalogProductList: ng.IComponentOptions = {
	template,
	bindings: {
		catalogId: '<',
		idType: '<',
	},
	controller,
};

controller.$inject = [
	'$location',
	'$rootScope',
	'User',
	'Utils',
	'catalogService',
];

function controller(
	$location: ng.ILocationService,
	$rootScope: ng.IRootScopeService,
	User,
	Utils,
	catalogService
) {
	window.prerenderReady = false;
	this.hasAPIKey = localized.settings.general.api_key;

	this.hits = [];
	this.isLoading = true;
	this.isSignedIn = User.isAuthed && User.email;
	this.viewAs = $location.search().viewas
		? $location.search().viewas
		: 'grid';

	this.$onInit = () => {
		if (this.hasAPIKey) {
			this.setAvailableStock();
			checkPunchout();

			this.pageUrls = {
				catalog: Utils.getPageUrl('catalog'),
			};
			catalogService.setCatalogId(this.catalogId, this.idType);
			this.currentPage = catalogService.getCurrentPage();

			return this.getCatalog().then((catalog) => {
				$rootScope.$emit('catalog.data:init', catalog);
			});
		}
	};

	$rootScope.$on('catalog.params:changes', () => {
		this.isLoading = true;
		return this.getCatalog();
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
	this.getCatalog = () => {
		return catalogService.getCatalog().then((catalog) => {
			if (catalog && catalog.hits) {
				this.hits = catalog.hits;
			}
			this.query = $location.search().q;
			this.hasActiveFilters = getActiveFilters(catalog.filters);
			this.isCategory = catalog.category ? true : false;
			this.category = catalog.category;
			this.isLoading = false;
			window.prerenderReady = true;
			$rootScope.$emit('catalog.data:changes');
			return this.hits;
		});
	};

	this.setAvailableStock = () => {
		const excludeSoldOut = localized.settings.general.excludeSoldOut;
		/* If Settings > Plugin > Catalog Filters > Exclude sold out items by default is checked, the available_stock parameter will be added, triggering the filter. This only happens the first time the catalog loads. */
		if (excludeSoldOut) {
			$location.search('available_stock', true);
		}
	};

	this.toggleView = () => {
		this.viewAs = this.viewAs === 'grid' ? 'list' : 'grid';
		$location.search('viewas', this.viewAs);
	};
}
