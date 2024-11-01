import template from './catalog-categories-list.component.html';

export const CatalogCategoriesList: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$httpParamSerializer',
	'$location',
	'$rootScope',
	'catalogService',
];

function controller(
	$httpParamSerializer: ng.IHttpParamSerializer,
	$location: ng.ILocationService,
	$rootScope: ng.IRootScopeService,
	catalogService
) {
	this.isLoading = true;
	this.list = [];

	this.$onInit = () => {
		this.catSlug = localized.settings.general.cat_slug || 'categories';

		$rootScope.$on('catalog.data:init', () => {
			this.list = catalogService.getCategories();
			this.params = getQueryParams();
		});

		$rootScope.$on('catalog.params:changes', () => {
			this.isLoading = true;
		});

		$rootScope.$on('catalog.data:changes', () => {
			this.list = catalogService.getCategories();
			this.params = getQueryParams();
			this.isLoading = false;
		});
	};

	const getQueryParams = (): string => {
		const search = $location.search();
		const params = {
			brand_name: search.brand_name ? search.brand_name : null,
			manufacturer: search.manufacturer ? search.manufacturer : null,
			q: search.q ? search.q : null,
		};
		return search.brand_name || search.manufacturer || search.q
			? `?${$httpParamSerializer(params)}`
			: '';
	};
}
