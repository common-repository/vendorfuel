import template from './catalog-results.component.html';

export const CatalogResults: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$rootScope', 'catalogService'];

function controller($rootScope: ng.IRootScopeService, catalogService) {
	this.isBusy = true;
	this.max = 1000;
	this.numResults = 0;

	$rootScope.$on('catalog.data:init', () => {
		this.refreshResults();
	});

	$rootScope.$on('catalog.params:changes', () => {
		this.isBusy = true;
	});

	$rootScope.$on('catalog.data:changes', () => {
		this.refreshResults();
	});

	this.refreshResults = () => {
		this.numResults = catalogService.getNumResults();
		this.currentPage = catalogService.getCurrentPage();
		this.dataLength = catalogService.getDataLength();
		this.query = catalogService.getQuery();
		this.params = catalogService.getParams();
		this.perPage = catalogService.getParams().rpp;
		this.isBusy = false;
	};

	this.composeResults = () => {
		const MAX = 32;
		const FROM =
			this.currentPage === 1 ? 1 : (this.currentPage - 1) * MAX + 1;
		const TO = (this.currentPage - 1) * MAX + this.dataLength;

		return `${
			this.numResults > MAX
				? `${FROM.toLocaleString()} to ${TO.toLocaleString()} of ${this.numResults.toLocaleString()}`
				: this.numResults.toLocaleString()
		} results`;
	};
}
