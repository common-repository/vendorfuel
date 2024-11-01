/**
 * Alert List Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	const template = `
        <div ng-repeat="alert in $ctrl.list track by $index"
            ng-if="alert.msg"
            ng-class="['alert alert-dismissible fade show', {
                'alert-warning': alert.type === 'warning',
                'alert-danger': alert.type === 'danger',
                'alert-info': alert.type === 'info',
                'alert-success': alert.type === 'success',
                'alert-secondary':
                    alert.type !== 'warning' &&
                    alert.type !== 'danger' &&
                    alert.type !== 'info' &&
                    alert.type !== 'success',
            }]">
            {{ alert.msg }}
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

	angular.module('vfApp').component('alertList', {
		controller: AlertListController,
		template,
	});

	AlertListController.$inject = ['Alerts'];

	/**
	 * @param {Object} Alerts VendorFuel service
	 */
	function AlertListController(Alerts) {
		const vm = this;
		vm.close = close;
		vm.list = Alerts.list;

		/**
		 * @param {Object} event Click event
		 * @param {number} index List index
		 */
		function close(event, index) {
			event.preventDefault();
			vm.list.splice(index, 1);
		}
	}
})();
