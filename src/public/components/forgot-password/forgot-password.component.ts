import template from './forgot-password.component.html';
import { emailPattern } from '../../common/patterns';

export const ForgotPasswordComponent = {
	template,
	controller: class ForgotPasswordController {
		static $inject = ['User', 'Utils'];
		public emailPattern: RegExp;
		public isSubmitted = false;
		public isSubmitting = false;

		constructor(private User: any, private Utils: any) {
			this.emailPattern = emailPattern;
		}

		onSubmit(customer: { email: string }) {
			const { email } = customer;
			const url = this.Utils.getPageUrl('reset-password');
			this.isSubmitting = true;

			this.User.requestPasswordReset(email, url).then((response) => {
				if (response.data.errors.length === 0) {
					this.isSubmitted = true;
				}
				this.isSubmitting = false;
			});
		}
	},
};
