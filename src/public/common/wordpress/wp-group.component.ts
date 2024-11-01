( function() {
	'use strict';

	const template = `
        <!-- wp:group -->
		<div 
            ng-class="['wp-block-group', $ctrl.backgroundColorClass, {
                'has-background': $ctrl.backgroundColor
            }]">
            <div class="wp-block-group__inner-container"
                ng-transclude>
            </div>
        </div>
        <!-- /wp:group -->	
	`;

	angular
		.module( 'vfApp' )
		.component( 'wpGroup', {
			bindings: {
				backgroundColor: '@?',
			},
			controller: GroupController,
			template,
			transclude: true,
		} );

	/**
	 */
	function GroupController() {
		const vm = this;
		vm.$onInit = $onInit;

		/**
		 */
		function $onInit() {
			vm.backgroundColorClass = vm.backgroundColor ? `has-${ vm.backgroundColor }-background-color` : '';
		}
	}
}() );
