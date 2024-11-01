import { toast } from 'react-toastify';
import template from './settings-plugin.component.html';
import type { Settings } from '../Settings';

export const SettingsPluginComponent: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = ['Localized', 'Utils'];

function controller(Localized, Utils) {
	const wpEndpoint = `${Localized.wpRestUrl}/settings/general`;

	this.$onInit = () => {
		getData();
	};

	/**
	 */
	const getData = () => {
		this.isLoading = true;

		Utils.httpGet(wpEndpoint).then((settings: Settings) => {
			this.settings = settings;
			this.isLoading = false;
		});
	};

	/**
	 * @param {Object} settings Options data
	 */
	this.update = (settings: Settings) => {
		this.isUpdating = true;

		const params = {
			settings: JSON.stringify(settings),
		};

		Utils.httpPost(wpEndpoint, params).then(() => {
			this.isUpdating = false;
			toast.info('Plugin settings have been updated.', { icon: false });
			location.reload(); // Force reloading of page so that localized object will have API key if it's been entered.
		});
	};
}
