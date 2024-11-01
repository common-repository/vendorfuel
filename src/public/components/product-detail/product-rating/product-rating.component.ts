import angular from 'angular';
import template from './product-rating.component.html';
/**
 * Product Rating Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('productRating', {
		bindings: {
			rating: '<',
		},
		controller: Controller,
		template,
	});

	/**
	 */
	function Controller() {
		const vm = this;
		vm.ratingTotal = 5;
		vm.getRepeater = getRepeater;

		/**
		 * @return {Array} Repeater for displaying star icons.
		 */
		function getRepeater() {
			return new Array(vm.ratingTotal);
		}
	}
})();
