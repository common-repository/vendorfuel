import template from './wp-button.component.html';

export const WpButtonComponent: ng.IComponentOptions = {
	bindings: {
		customFontSize: '@?',
		customWidth: '<?',
		isDisabled: '<?',
		isLoading: '<?',
		isStyleDelete: '<?',
		isStyleOutline: '<?',
		link: '<?',
		onClick: '&?',
		type: '@?',
	},
	controller: class WpButtonController {
		customStyles: {
			width?: string;
			background?: string;
			wordBreak?: string;
		};
		customWidth: number;
		isStyleDelete: boolean;

		$onInit() {
			this.customStyles = {
				wordBreak: 'initial',
			};
			if ( this.customWidth ) {
				this.customStyles.width = this.customWidth.toString() + '%';
			}
			if ( this.isStyleDelete ) {
				this.customStyles.background = 'none';
			}
		}
	},
	template,
	transclude: true,
};
