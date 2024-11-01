import { toast } from 'react-toastify';
import template from './settings-options.component.html';

export const SettingsOptionsComponent: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['Localized', 'Utils'];

function controller(Localized, Utils) {
	const apiEndpoint = `${localized.apiURL}/stores`;
	const wpEndpoint = `${Localized.wpRestUrl}/settings/store`;

	this.$onInit = () => {
		getData();
	};

	const getData = () => {
		this.isLoading = true;

		Utils.httpGet(apiEndpoint).then((response) => {
			this.options = processOptions(response.store.options);
			this.store = response.store;
			this.isLoading = false;
		});
	};

	/**
	 * @param {Object} options Settings options
	 * @return {Array} Options
	 */
	function processOptions(options: { [key: string]: boolean }) {
		const deprecated = ['Load Footer Template', 'Load Menu Nav Template'];
		return Object.entries(options)
			.filter((option) => {
				const [key] = option;
				return !deprecated.includes(key);
			})
			.map((option) => {
				const [key, value] = option;
				return {
					key,
					value,
				};
			});
	}

	/**
	 * @param {Object} data Options data
	 */
	this.update = (data) => {
		this.isUpdating = true;
		const options = Object.fromEntries(
			data.map((option) => {
				return [option.key, option.value];
			})
		);

		const body = {
			options,
		};

		Utils.httpPut(apiEndpoint, null, body).then(() => {
			const params = body;
			Utils.httpPost(wpEndpoint, params).then(() => {
				toast.info('Setting options have been updated.');
				this.isUpdating = false;
				getData();
			});
		});
	};
}
