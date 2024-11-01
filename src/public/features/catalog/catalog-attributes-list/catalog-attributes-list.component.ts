import template from './catalog-attributes-list.component.html';

export const CatalogAttributesList: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = ['$rootScope', 'catalogService'];

/**
 * @param {Object} $rootScope     AngularJS service.
 * @param {Object} catalogService Catalog service.
 */
function controller($rootScope, catalogService) {
	const vm = this;
	vm.isCollapsed = false;
	vm.isInProgress = true;
	vm.refreshAttributes = refreshAttributes;

	$rootScope.$on('catalog.params:changes', () => {
		vm.isInProgress = true;
	});

	$rootScope.$on('catalog.data:init', () => {
		refreshAttributes();
	});

	$rootScope.$on('catalog.data:changes', () => {
		refreshAttributes();
	});

	/**
	 */
	function refreshAttributes() {
		vm.attributes = catalogService.getAttributes();
		vm.isInProgress = false;
	}
}
