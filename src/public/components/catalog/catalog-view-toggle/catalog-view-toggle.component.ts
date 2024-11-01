import angular from 'angular';
import template from './catalog-view-toggle.component.html';

/**
 * @namespace catalogViewToggle
 * @memberof Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('catalogViewToggle', {
		template,
		bindings: {
			viewAs: '<',
			onToggle: '&',
		},
		controller: ToggleController,
	});

	ToggleController.$inject = ['$location'];

	/**
	 * @param {Object} $location Angular service
	 */
	function ToggleController($location) {
		this.$onInit = () => {
			this.viewAs = $location.search().viewas
				? $location.search().viewas
				: 'grid';
		};

		/**
		 * @function toggle
		 * @param {string} view View
		 */
		this.toggle = (view) => {
			this.onToggle({ view });
		};
	}
})();
