import template from './cart-download-csv.component.html';

import type { Localized } from '../../../types';
declare const localized: Localized;

export const CartDownloadCSVComponent: ng.IComponentOptions = {
	template,
	controller: class CartDownloadCSVController {
		static $inject: string[] = ['$http'];

		// eslint-disable-next-line no-useless-constructor
		constructor(private $http: ng.IHttpService) {}

		downloadCSV() {
			const url = `${localized.apiURL}/cart/csv`;
			this.$http.post(url, {}).then((response: { data: any }) => {
				const blob = new Blob([response.data], { type: 'text/csv' });
				const downloadUrl = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = downloadUrl;
				a.download = 'cart.csv';
				document.body.appendChild(a);
				a.click();
			});
		}
	},
};
