import template from './catalog-filters.component.html';

export const CatalogFilters: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$location', '$rootScope'];

function controller(
	$location: ng.ILocationService,
	$rootScope: ng.IRootScopeService
) {
	this.settings = localized.settings.general;
	this.hasAnyFilters =
		localized.settings.store.options['Inventory System'] ||
		localized.settings.general.enableAbilityOne ||
		localized.settings.general.enableCoreList ||
		localized.settings.general.enableGSA ||
		localized.settings.general.enableRecyclable;
	this.hasInventory = localized.settings.store.options['Inventory System'];
	this.isLoading = true;

	this.$onInit = () => {
		$rootScope.$on('catalog.params:changes', () => {
			this.isLoading = true;
		});

		$rootScope.$on('catalog.data:init', () => {
			this.isLoading = false;
			this.refreshFilters();
		});

		$rootScope.$on('catalog.data:changes', () => {
			this.isLoading = false;
			this.refreshFilters();
		});
	};

	this.onClickCollapse = (): boolean => {
		this.isCollapsingFilters = !this.isCollapsingFilters;
		const newPosition = jQuery('catalog-header').offset();
		jQuery('html, body')
			.stop()
			.animate({ scrollTop: newPosition.top }, 500);
		return false;
	};

	this.refreshFilters = () => {
		const search = $location.search();
		this.isShowingOnlyStock = search.available_stock ? true : false;
		this.isShowingRecycled = search.recycled ? true : false;
		this.isShowingGSA = search.gsa ? true : false;
		this.isShowingCoreList = search.core_list ? true : false;
		this.isShowingAbilityOne = search.ability_one ? true : false;
	};

	this.toggleFilter = (key: string) => {
		if (key === 'isShowingOnlyStock') {
			const paramValue = this.isShowingOnlyStock ? true : null;
			$location.search('available_stock', paramValue);
		} else if (key === 'isShowingRecycled') {
			const paramValue = this.isShowingRecycled ? true : null;
			$location.search('recycled', paramValue);
		} else if (key === 'isShowingGSA') {
			const paramValue = this.isShowingGSA ? true : null;
			$location.search('gsa', paramValue);
		} else if (key === 'isShowingCoreList') {
			const paramValue = this.isShowingCoreList ? true : null;
			$location.search('core_list', paramValue);
		} else if (key === 'isShowingAbilityOne') {
			const paramValue = this.isShowingAbilityOne ? true : null;
			$location.search('ability_one', paramValue);
		}
		$location.search('pg', null);
		$rootScope.$emit('catalog.params:changes');
	};
}
