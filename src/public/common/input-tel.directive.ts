/**
 * Input Tel Directive
 * Parses input to match telephone number format.
 *
 * @namespace Directives
 */
( function() {
	'use strict';

	angular
		.module( 'vfApp' )
		.directive( 'inputTel', inputTel );

	inputTel.$inject = [
		'$browser',
		'$filter',
	];

	/**
	 * @param {Object} $browser AngularJS service
	 * @param {Object} $filter  AngularJS service
	 * @return {Object} Directive
	 */
	function inputTel(
		$browser,
		$filter,
	) {
		return {
			require: 'ngModel',
			link( $scope, $element, $attrs, ngModelCtrl ) {
				const listener = function() {
					const value = $element.val().replace( /[^0-9]/g, '' );
					$element.val( $filter( 'tel' )( value, false ) );
				};

				// This runs when we update the text field
				ngModelCtrl.$parsers.push( function( viewValue ) {
					return viewValue.replace( /[^0-9]/g, '' ).slice( 0, 10 );
				} );

				// This runs when the model gets updated on the scope directly and keeps our view in sync
				ngModelCtrl.$render = function() {
					$element.val( $filter( 'tel' )( ngModelCtrl.$viewValue, false ) );
				};

				$element.on( 'change', listener );
				$element.on( 'keydown', function( event ) {
					const key = event.keyCode;
					// If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
					// This lets us support copy and paste too
					if ( key === 91 || ( 15 < key && key < 19 ) || ( 37 <= key && key <= 40 ) ) {
						return;
					}
					$browser.defer( listener ); // Have to do this or changes don't get picked up properly
				} );

				$element.on( 'paste cut', function() {
					$browser.defer( listener );
				} );
			},

		};
	}
}() );
