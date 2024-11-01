import template from './template.html';

export const CatalogTitle: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$rootScope', 'catalogService'];

/**
 * @param {Object} $rootScope     Angular service
 * @param {Object} catalogService Catalog service
 */
function controller($rootScope: ng.IRootScopeService, catalogService) {
	this.showSubcategoryCards = localized.settings.general.showSubcategoryCards;
	this.description = '';
	this.isLoading = true;
	this.title = 'Catalog';

	$rootScope.$on('catalog.data:init', () => {
		this.title = catalogService.getTitle();
		this.description = catalogService.getDescription();
		this.subcategories = catalogService.getSubcategories();
	});
}
