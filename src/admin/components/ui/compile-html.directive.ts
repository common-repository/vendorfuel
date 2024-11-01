compileHtmlDirective.$inject = ['$compile'];

/**
 * @param {Object} $compile Angular service
 * @return {Object} Directive
 */
export function compileHtmlDirective($compile: ng.ICompileService) {
	return {
		restrict: 'A',
		link(scope: ng.IScope, elem: any, attrs: ng.IAttributes) {
			scope.$watch(
				() => scope.$eval(attrs.compileHtml),
				(value) => {
					elem.html(value);
					$compile(elem.contents())(scope);
				}
			);
		},
	};
}
