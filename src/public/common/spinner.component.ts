/**
 * Spinner Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	const template = `
		<!-- wp:spacer {"height":30} -->
		<div style="height:30px" aria-hidden="true" class="wp-block-spacer"
			ng-if="$ctrl.size !== 'sm'"></div>
		<!-- /wp:spacer -->
		<div class="d-flex align-items-center"
			ng-if="$ctrl.text">
			<strong>{{ $ctrl.text }}&hellip;</strong>
			<div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
		</div>
		<div class="d-flex justify-content-center"
			ng-if="$ctrl.size !== 'sm' && !$ctrl.text">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
		<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="vertical-align:middle"
			ng-if="$ctrl.size === 'sm'">
		</span>
		<!-- wp:spacer {"height":30} -->
		<div style="height:30px" aria-hidden="true" class="wp-block-spacer"
			ng-if="$ctrl.size !== 'sm'"></div>
		<!-- /wp:spacer -->
		`;

	angular.module('vfApp').component('vfSpinner', {
		bindings: {
			size: '@?',
			text: '@?',
		},
		template,
	});
})();
