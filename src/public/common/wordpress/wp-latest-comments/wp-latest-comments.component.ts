(function () {
	'use strict';

	const template = require('./wp-latest-comments.html').default;
	angular.module('vfApp').component('wpLatestComments', {
		bindings: {
			comments: '<',
		},
		controller: LatestCommentsController,
		template,
	});

	/**
	 */
	function LatestCommentsController() {
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
