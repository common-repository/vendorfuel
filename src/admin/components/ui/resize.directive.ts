resizeDirective.$inject = [
	'$window',
];

/**
 * @param {Object} $window Angular service
 * @return {Object} Directive
 */
export function resizeDirective(
	$window: ng.IWindowService,
) {
	return function( $scope: any ) {
		getSizing();
		angular.element( $window ).on( 'resize', function() {
			$scope.$apply( function() {
				getSizing();
			} );
		} );
		/**
		 *
		 */
		function getSizing() {
			$scope.width = $window.innerWidth;
			checkSizing( $scope.width );
		}
		/**
		 * @param {number} w Width
		 */
		function checkSizing( w: number ) {
			if ( w < 576 ) {
				setBools( true );
			} else if ( ( w >= 576 ) && ( w < 768 ) ) {
				setBools( false, true );
			} else if ( ( w >= 768 ) && ( w < 992 ) ) {
				setBools( false, false, true );
			} else if ( ( w >= 992 ) && ( w < 1200 ) ) {
				setBools( false, false, false, true );
			} else if ( w >= 1200 ) {
				setBools( false, false, false, false, true );
			}
		}
		/**
		 * @param {boolean} xs Viewport size
		 * @param {boolean} sm Viewport size
		 * @param {boolean} md Viewport size
		 * @param {boolean} lg Viewport size
		 * @param {boolean} xl Viewport size
		 */
		function setBools( xs: boolean, sm?: boolean, md?: boolean, lg?: boolean, xl?: boolean ) {
			$scope.isXS = xs || false;
			$scope.isSM = sm || false;
			$scope.isMD = md || false;
			$scope.isLG = lg || false;
			$scope.isXL = xl || false;
		}
	};
}
