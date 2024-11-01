export class CustomerNotesService {
	static $inject: string[] = ['$http', 'Localized'];

	private apiRoot = `${localized.apiURL}/admin/customers`;
	private $http: ng.IHttpService;
	private Localized: any;

	constructor($http: ng.IHttpService, Localized: any) {
		this.$http = $http;
		this.Localized = Localized;
	}

	query(id: number) {
		return this.$http
			.get(`${this.apiRoot}/${id}/notes`)
			.then((response: any) => {
				if (!response.data.errors.length) {
					return response.data;
				}
			});
	}

	save(id: number, data: { content: string }) {
		return this.$http
			.post(`${this.apiRoot}/${id}/notes`, data)
			.then(() => {});
	}

	remove(customerId: number, noteId: number) {
		return this.$http
			.delete(`${this.apiRoot}/${customerId}/notes/${noteId}`)
			.then(() => {});
	}
}
