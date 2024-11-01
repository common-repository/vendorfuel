import template from './wp-button.html';

export const WpButtonComponent = {
	bindings: {
		onClick: '&?',
		onDelete: '&?',
		isLoading: '<?',
		isPrimary: '<?',
	},
	template,
	transclude: true,
	controller: class ButtonController {
		onClick?: any;
		onDelete?: any;
		isConfirming: boolean;
		isLoading: boolean;
		isPrimary: boolean;
		hasLoader: boolean;

		click() {
			if (this.onDelete) {
				this.isConfirming = true;
			} else {
				this.onClick();
			}
		}

		delete(id?: number) {
			this.onDelete(id);
		}
	},
};
