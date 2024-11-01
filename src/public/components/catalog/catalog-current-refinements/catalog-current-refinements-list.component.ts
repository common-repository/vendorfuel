import angular from 'angular';
import template from './catalog-current-refinements-list.component.html';

/**
 * @namespace catalogCurrentRefinementsList
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('catalogCurrentRefinementsList', {
		template,
		controller: RefinementsController,
	});

	RefinementsController.$inject = ['$location', '$rootScope'];

	/**
	 * @param {Object} $location  Angular service
	 * @param {Object} $rootScope Angular service
	 */
	function RefinementsController($location, $rootScope) {
		const vm = this;
		vm.isLoading = true;
		vm.onClickRemove = onClickRemove;
		vm.onClickRemoveAll = onClickRemoveAll;
		vm.refinements = [];
		vm.refreshData = refreshData;

		$rootScope.$on('catalog.params:changes', () => {
			vm.isLoading = true;
		});

		$rootScope.$on('catalog.data:init', () => {
			refreshData();
		});

		$rootScope.$on('catalog.data:changes', () => {
			refreshData();
		});

		/**
		 */
		function refreshData() {
			vm.isLoading = false;
			vm.refinements = getRefinements();
		}

		/**
		 * @return {Array} Refinements.
		 */
		function getRefinements() {
			const search = $location.search();
			const pattern = /attr|brand_name|manufacturer/i;
			const refinements = Object.entries(search)
				.filter((element) => {
					const [key] = element;
					return pattern.test(key);
				})
				.map((element) => {
					const [key, value] = element;
					if (Array.isArray(value)) {
						return value.map((el) => {
							return {
								name: getRefinementName(key),
								key,
								value: el,
							};
						});
					} else if (value) {
						return {
							name: getRefinementName(key),
							key,
							value,
						};
					}
					return false;
				});
			return refinements.flat();
		}

		/**
		 * @name getRefinementName
		 * @param {string} key Algolia facet name
		 * @return {string} Human-readable key for badges.
		 */
		function getRefinementName(key) {
			if (key === 'brand_name') {
				return 'Brand: ';
			} else if (key === 'manufacturer') {
				return 'Manufacturer: ';
			}
			return `${key.replace('attr:', '')}: `;
		}

		/**
		 * @param {Object} refinement Refinement
		 */
		function onClickRemove(refinement) {
			removeRefinement(refinement);
			$location.search('pg', null);
			$rootScope.$emit('catalog.params:changes');
		}

		/**
		 */
		function onClickRemoveAll() {
			vm.refinements.forEach((refinement) => {
				removeRefinement(refinement);
			});
			$location.search('pg', null);
			$rootScope.$emit('catalog.params:changes');
		}

		/**
		 * @param {Object} refinement Refinement
		 */
		function removeRefinement(refinement) {
			const { key, value } = refinement;
			const oldParamValue = [$location.search()[key]].flat();
			const newParamValue = oldParamValue.filter(
				(element) => element !== value
			);
			$location.search(key, newParamValue);
		}
	}
})();
