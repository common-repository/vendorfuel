import { toast } from 'react-toastify';
import type { Localized } from '../../types';
import template from './taxes-avalara.component.html';
declare const localized: Localized;

export const TaxesAvalaraComponent: ng.IComponentOptions = {
	template,
	controller: class TaxesAvalaraController {
		static $inject: string[] = ['AlertModal', 'Utils'];
		baseURL: string;
		isDeleting: boolean;
		isLoading: boolean;
		form: any;
		isGettingLog: boolean;
		isUpdating: boolean;

		constructor(private AlertModal: any, private Utils: any) {
			this.baseURL = `${localized.apiURL}/admin/tax/avalara`;
		}

		$onInit() {
			this.getData();
		}

		deleteData() {
			this.isDeleting = true;
			this.Utils.httpDelete(this.baseURL).then(() => {
				this.form = {};
				this.isDeleting = false;
			});
		}

		getData() {
			this.isLoading = true;
			this.Utils.httpGet(`${this.baseURL}/config`).then(
				(response: any) => {
					this.form = response.avalara_config;
					this.isLoading = false;
				}
			);
		}

		test() {
			this.isLoading = true;
			this.Utils.httpPost(`${this.baseURL}/test`, this.form).then(
				(response: any) => {
					if (response.errors.length) {
						toast.error('Avalara connection test failed!', {
							autoClose: false,
						});
					} else {
						toast.success('Avalara connection test successful!');
					}
					this.isLoading = false;
				}
			);
		}

		update() {
			this.isUpdating = true;
			const data = { ...this.form };

			this.Utils.httpPut(`${this.baseURL}/config`, null, data).then(
				() => {
					this.isUpdating = false;
				}
			);
		}

		viewLog() {
			this.isGettingLog = true;
			this.Utils.httpPost(`${this.baseURL}/log`, this.form)
				.then((response: any) => {
					if (response.log) {
						const callback = {
							confirm() {
								angular.noop();
							},
						};
						this.AlertModal.Show(
							callback,
							'Connection Test Results',
							response.log,
							'Ok'
						);
					} else {
						toast.info('No saved logs found.', { icon: false });
					}
				})
				.finally(() => {
					this.isGettingLog = false;
				});
		}
	},
};
