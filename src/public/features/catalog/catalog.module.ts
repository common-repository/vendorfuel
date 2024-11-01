import angular from 'angular';
import { catalogService } from './catalog.factory';
import { CatalogCategoriesList } from './catalog-categories-list/catalog-categories-list.component';
import { CatalogSubcategories } from './catalog-subcategories';
import { CatalogFacetList } from './catalog-facet-list/catalog-facet-list.component';
import { CatalogFilters } from './catalog-filters/catalog-filters.component';
import { CatalogAttributesListItem } from './catalog-attributes-list/catalog-attributes-list-item.component';
import { CatalogAttributesList } from './catalog-attributes-list/catalog-attributes-list.component';
import { CatalogResults } from './catalog-results/catalog-results.component';
import { CatalogTitle } from './catalog-title';

export const CatalogModule = angular
	.module('CatalogModule', [])
	.factory('catalogService', catalogService)
	.component('catalogAttributesListItem', CatalogAttributesListItem)
	.component('catalogAttributesList', CatalogAttributesList)
	.component('catalogCategoriesList', CatalogCategoriesList)
	.component('catalogFacetList', CatalogFacetList)
	.component('catalogFilters', CatalogFilters)
	.component('catalogResults', CatalogResults)
	.component('catalogSubcategories', CatalogSubcategories)
	.component('catalogTitle', CatalogTitle).name;
