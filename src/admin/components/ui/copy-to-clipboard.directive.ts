export function copyToClipboardDirective() {
	return {
		restrict: 'A',
		link(
			scope: ng.IScope,
			elem: ng.IAugmentedJQuery,
			attrs: ng.IAttributes
		) {
			elem.on('click', () => {
				if (attrs.copyToClipboard) {
					const $tempInput = jQuery('<input>');
					jQuery('clipboard').append($tempInput);
					$tempInput.val(attrs.copyToClipboard).select();
					document.execCommand('copy');
				}
			});
		},
	};
}
