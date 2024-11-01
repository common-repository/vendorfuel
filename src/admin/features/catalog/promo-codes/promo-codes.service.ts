import type { Localized } from '../../../types';

declare const localized: Localized;

export class PromoCodesService {
	static $inject: string[] = ['$http', 'Localized'];
	private apiRoot = `${localized.apiURL.replace(
		'v1',
		'v2'
	)}/admin/promocodes`;

	constructor(private $http: ng.IHttpService) {}

	delete(id: number) {
		return this.$http.delete(`${this.apiRoot}/${id}`).then(() => {});
	}

	get(id: number) {
		return this.$http
			.get(`${this.apiRoot}/${id}`)
			.then((response: { data: any }) => {
				if (!response.data.errors.length) {
					return response.data;
				}
			});
	}

	query(params?: { string: string }) {
		return this.$http
			.get(this.apiRoot, { params })
			.then((response: any) => {
				if (!response.data.errors.length) {
					return response.data;
				}
			});
	}

	save(data: { string: string }) {
		return this.$http
			.post(this.apiRoot, data)
			.then((response: { data: any }) => {
				return response.data;
			});
	}

	update(id: number, data: { string: string }) {
		return this.$http.put(`${this.apiRoot}/${id}`, data).then(() => {});
	}
}
