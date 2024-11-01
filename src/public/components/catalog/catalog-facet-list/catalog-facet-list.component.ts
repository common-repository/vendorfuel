import template from './catalog-facet-list.component.html';
declare const angular: ng.IAngularStatic;

/**
 * Catalog Facets List Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	angular
		.module( 'vfApp' )
		.component( 'catalogFacetList', {
			bindings: {
				facetName: '@',
				facetTitle: '@',
			},
			controller: FacetsListController,
			template,
		} );

	FacetsListController.$inject = [
		'$location',
		'$rootScope',
		'Products',
		'catalogService',
	];

	/**
	 * @param {Object} $location      AngularJS service.
	 * @param {Object} $rootScope     AngularJS service.
	 * @param {Object} Products       VendorFuel service.
	 * @param {Object} catalogService Catalog service.
	 */
	function FacetsListController(
		$location,
		$rootScope,
		Products,
		catalogService,
	) {
		const vm = this;
		vm.isInProgress = true;
		vm.isShowingSearchResults = false;
		vm.isCollapsed = false;
		vm.limit = 10;
		vm.onClickApply = onClickApply;
		vm.refreshFacets = refreshFacets;
		vm.resetFacetSearch = resetFacetSearch;
		vm.toggleLimit = toggleLimit;

		$rootScope.$on( 'catalog.params:changes', () => {
			vm.isInProgress = true;
		} );

		$rootScope.$on( 'catalog.data:init', () => {
			refreshFacets();
		} );

		$rootScope.$on( 'catalog.data:changes', () => {
			refreshFacets();
		} );

		/**
		 */
		function refreshFacets() {
			vm.facets = catalogService.getFacets( vm.facetName );
			vm.query = '';
			vm.isShowingSearchResults = false;
			vm.isInProgress = false;
		}

		/**
		 */
		function toggleLimit() {
			vm.limit = vm.limit === 10 ? 1000 : 10;
		}

		/**
		 * @param {string} key  Key
		 * @param {Object} form Form
		 */
		function onClickApply( key, form ) {
			const checkedValues =
				vm.facets.filter( ( element ) => element.isChecked );
			const uncheckedValues =
				vm.facets.filter( ( element ) => ! element.isChecked );

			if ( ! $location.search()[ key ] ) {
				const valueNames = checkedValues.map( ( element ) => element.value );
				$location.search( key, valueNames );
			} else {
				const search = $location.search()[ key ];
				let valueNames = [];

				// Add the current search parameter values
				if ( Array.isArray( search ) ) {
					valueNames = search;
				} else {
					valueNames.push( search );
				}

				// Remove any unchecked values.
				valueNames = valueNames.filter( ( element ) => {
					return uncheckedValues.some( ( el ) => el.value !== element );
				} );

				// Add any checked values, making sure it's not being added twice.
				checkedValues.forEach( ( element ) => {
					if ( ! [ search ].flat().some( ( value ) => value === element.value ) ) {
						valueNames.push( element.value );
					}
				} );

				$location.search( key, valueNames );
			}
			$location.search( 'pg', null );
			$rootScope.$emit( 'catalog.params:changes' );
			form.$setPristine();
		}

		const hasRecycledEnabled = () => {
			const search = $location.search();
			return search.recycled || search.recycled === true ? true : false;
		};

		const hasInStockEnabled = () => {
			const search = $location.search();
			return search.available_stock === 'false' || search.available_stock === false ? false : true;
		};

		this.searchFacets = ( event: Event, query: string ) => {
			if ( event.type === 'click' || event.keyCode === 13 ) {
				this.isInProgress = true;
				this.cachedQuery = query;
				this.hasStockOrRecycledApplied = hasInStockEnabled() || hasRecycledEnabled();

				const params = {
					cat: catalogService.getCategoryId(),
					facetName: this.facetName,
					facetQuery: query,
					pcrc: hasRecycledEnabled(),
					available_stock: hasInStockEnabled(),
				};

				Products.list( params )
					.then( ( response ) => response.data )
					.then( ( data ) => {
						this.facets = getFacetSearchResults( data.facet_search_results, this.facetName );
						this.isInProgress = false;
						this.isShowingSearchResults = true;
					} );
			}
		};

		/**
		 * @param {Array}  results   Facet search results.
		 * @param {string} facetName Facet name.
		 * @return {Object} Results.
		 */
		function getFacetSearchResults( results, facetName ) {
			return results.map( ( element ) => {
				return {
					value: element.value,
					results: element.count,
					isChecked: isResultChecked( facetName, element.value ),
				};
			} );
		}

		/**
		 * @param {string} key   Key
		 * @param {string} value Value
		 * @return {boolean} Returns if result is checked.
		 */
		function isResultChecked( key, value ) {
			const search = $location.search()[ key ];
			if ( Array.isArray( search ) ) {
				return search.includes( value );
			} else if ( search ) {
				return search === value;
			}
			return false;
		}

		/**
		 */
		function resetFacetSearch() {
			refreshFacets();
		}
	}
}() );
