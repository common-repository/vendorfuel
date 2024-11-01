fileModelDirective.$inject = ['$parse'];

/**
 * @param {Object} $parse Angular service
 * @return {Object} Directive
 */
export function fileModelDirective($parse: ng.IParseService) {
	return {
		restrict: 'A',
		link(scope: ng.IScope, element: any, attrs: ng.IAttributes) {
			const model = $parse(attrs.fileModel);
			const modelSetter = model.assign;

			element.on('change', () => {
				scope.$apply(() => {
					modelSetter(scope.$parent.$parent, element[0].files);
				});
			});
		},
	};
}
