/**
 * Alert Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	const template = `
        <!-- wp:paragraph -->
        <p ng-class="['has-background', {
            'has-black-color has-luminous-vivid-amber-background-color': $ctrl.type === 'warning',
            'has-black-color has-very-light-gray-background-color': $ctrl.type !== 'warning',
            }]">
            {{ $ctrl.msg }}
        </p>
        <!-- /wp:paragraph -->
        `;
	angular
		.module( 'vfApp' )
		.component( 'vfAlert', {
			bindings: {
				msg: '<',
				type: '@',
			},
			controller: AlertController,
			template,
		} );

	/**
	 */
	function AlertController() {
		// const vm = this;
	}
}() );
