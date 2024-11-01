import { toast } from 'react-toastify';
import template from './settings-store.component.html';

interface Store {
	name: string;
	url: string;
	options: { [key: string]: boolean }[];
}

export const SettingsStoreComponent: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = ['$http'];

function controller($http: ng.IHttpService) {
	this.$onInit = () => {
		getData();
	};

	const getData = () => {
		this.isBusy = true;
		const url = `${localized.apiURL}/stores`;

		$http
			.get(url)
			.then((response) => response.data)
			.then((data: { store: Store }) => {
				this.store = data.store;
				this.isBusy = false;
			});
	};

	this.update = () => {
		this.isBusy = true;
		const url = `${localized.apiURL}/stores`;
		const data = this.store;

		$http
			.post(url, data)
			.then((response) => response.data)
			.then(() => {
				// After updating the VF API, update the WP API with minimal data that's currently used.
				const wpURL = `${localized.dir.wpRestUrl}vendorfuel/settings/store`;
				const wpData = {
					name: this.store.name,
					url: this.store.url,
				};

				$http
					.post(wpURL, wpData, {
						params: { options: this.store.options },
					})
					.then((response) => response.data)
					.then(() => {
						toast.info('Store settings have been updated.');
						this.isBusy = false;
					});
			});
	};
}
