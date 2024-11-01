(function () {
	'use strict';
	const template = require('./wp-spacer.html').default;

	angular.module('vfApp').component('wpSpacer', {
		bindings: {
			heightInPixels: '<?',
		},
		controller: SpacerController,
		template,
	});

	function SpacerController() {
		const vm = this;
		vm.$onInit = $onInit;

		function $onInit() {
			vm.heightInPixels = vm.heightInPixels || 100;
		}
	}
})();
