import { toast } from 'react-toastify';
import template from './settings-analytics.component.html';

export const SettingsAnalyticsComponent: ng.IComponentOptions = {
	template,
	controller,
};

function controller(Localized, Utils) {
	const wpEndpoint = `${Localized.wpRestUrl}/settings/analytics`;

	this.$onInit = () => {
		getData();
	};

	const getData = () => {
		this.isLoading = true;

		Utils.httpGet(wpEndpoint).then((data) => {
			this.settings = {
				AW: data.AW,
				conversions: data.conversions,
				UA: data.UA,
				verification: data.verification,
			};
			this.isLoading = false;
		});
	};

	this.update = (settings) => {
		this.isUpdating = true;

		const params = {
			settings: JSON.stringify(settings),
		};

		Utils.httpPost(wpEndpoint, params).then(() => {
			toast.info('Analytics settings have been updated.');
			this.isUpdating = false;
			getData();
		});
	};
}

controller.$inject = ['Localized', 'Utils'];
