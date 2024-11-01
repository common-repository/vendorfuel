import template from './wp-form-field.html';

export const WpFormFieldComponent = {
	bindings: {
		description: '@?',
		field: '<',
		header: '@?',
		isDisabled: '<?',
		isReadonly: '<?',
		label: '@',
		onChange: '&?',
		options: '<?',
		type: '@?',
	},
	controller: class WpFormFieldController {
		field: string;
		type?: 'text' | 'password' | 'textarea' | 'email';
		onChange: any;

		constructor() {
			this.type = this.type || 'text';
		}

		change(value: string) {
			this.onChange({ value });
		}
	},
	template,
	transclude: true,
};
