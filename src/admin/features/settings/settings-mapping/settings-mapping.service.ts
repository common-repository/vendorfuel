import { toast } from 'react-toastify';
export class SettingsMappingService {
	static $inject = ['$http', 'Localized'];
	url: string;

	constructor(private $http: ng.IHttpService, private Localized: any) {
		this.url = `${Localized.wpRestUrl}/vendorfuel/pages`;
	}

	get() {
		return this.$http.get(this.url).then((response: any) => {
			return response.data;
		});
	}

	update(data: { map: string }) {
		return this.$http.post(this.url, data).then((response: any) => {
			// Manually set a notification since the WP Rest API won't return a success message.
			if (response.status === 200) {
				toast.info('Page mapping settings have been updated.', {
					icon: false,
				});
			}
		});
	}
}
