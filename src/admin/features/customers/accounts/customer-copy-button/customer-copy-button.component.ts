import { Modal } from 'bootstrap';
import template from './customer-copy-button.html';

export const CustomerCopyButtonComponent: ng.IComponentOptions = {
	bindings: {
		customerId: '<',
		onCopy: '&',
	},
	template,
	controller: class CustomerCopyButtonController {
		static $inject = ['CustomersService'];
		private customerId: number;
		private onCopy: any;
		private modal: Modal;
		public email: string;
		public isCopying: boolean;
		public isShowingPassword: boolean;
		public isShowingPasswordConfirmation: boolean;
		public passwordHas = {
			all: (password: string) => {
				return (
					this.passwordHas.length(password) &&
					this.passwordHas.uppercase(password) &&
					this.passwordHas.lowercase(password) &&
					this.passwordHas.number(password) &&
					this.passwordHas.symbol(password)
				);
			},
			length: (password: string) => {
				return password?.length >= 8;
			},
			uppercase: (password: string) => {
				return password && RegExp('[A-Z]').test(password);
			},
			lowercase: (password: string) => {
				return password && RegExp('[a-z]').test(password);
			},
			number: (password: string) => {
				return password && RegExp('[0-9]').test(password);
			},
			symbol: (password: string) => {
				return password && /\p{Z}|\p{S}|\p{P}/u.test(password);
			},
		};
		public tempPassword: string;
		public tempPasswordConfirmation: string;

		constructor(private CustomersService: any) {
			this.modal = new Modal(
				document.getElementById('copyCustomerModal')
			);
		}

		copyCustomer() {
			this.isCopying = true;
			const data = {
				email: this.email,
				temp_password: this.tempPassword,
				temp_password_confirmation: this.tempPasswordConfirmation,
			};
			this.CustomersService.copy(this.customerId, data).then(
				(response: any) => {
					this.isCopying = false;
					if (!response.errors.length) {
						const { customer: copiedCustomer } = response;
						this.onCopy({ copiedCustomer });
						this.modal.hide();
					}
				}
			);
		}

		openModal() {
			this.modal.show();
		}
	},
};
