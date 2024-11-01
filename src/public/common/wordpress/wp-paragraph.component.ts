( function() {
	'use strict';

	const template = `
        <!-- wp:paragraph -->
		<p 
            ng-class="['has-' + $ctrl.backgroundColor + '-background-color', {
                'has-background': $ctrl.backgroundColor
            }]"
            ng-transclude>
        </p>
        <!-- /wp:paragraph -->	
	`;

	angular
		.module( 'vfApp' )
		.component( 'wpParagraph', {
			bindings: {
				backgroundColor: '@',
			},
			template,
			transclude: true,
		} );
}() );
