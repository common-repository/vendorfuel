formatDirective.$inject = ['$filter'];

/**
 * @param {Object} $filter Angular service
 * @return {Object} Directive
 */
export function formatDirective($filter: any) {
	return {
		require: '?ngModel',
		link(scope: any, elem: any, attrs: any, ctrl: any) {
			if (!ctrl) {
				return;
			}
			ctrl.$formatters.unshift(() =>
				$filter(attrs.format)(ctrl.$modelValue)
			);
			elem.on('focus', () => {
				elem.val(ctrl.$modelValue);
			});
			elem.on('blur', () => {
				const plainNumber = elem.val().replace(/[^\d|\-+|.+]/g, '');
				elem.val($filter(attrs.format)(plainNumber));
			});
			angular.element(elem).on('keypress', function (e) {
				const newVal =
					jQuery(this).val() +
					(e.charCode !== 0 ? String.fromCharCode(e.charCode) : '');
				if (
					jQuery(this)
						.val()
						.search(/(.*)\.[0-9][0-9]/) === 0 &&
					newVal.length > jQuery(this).val().length
				) {
					if (e.charCode !== 8) {
						e.preventDefault();
					}
				}
			});
		},
	};
}
