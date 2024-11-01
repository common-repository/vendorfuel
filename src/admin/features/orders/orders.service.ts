export class OrdersService {
	private apiRoot = `${localized.apiURL}/admin/orders/`;
	private $http: ng.IHttpService;

	static $inject: string[] = ['$http'];

	constructor($http: ng.IHttpService) {
		this.$http = $http;
	}

	query(params: { string: string }) {
		return this.$http.get(this.apiRoot, {
			params,
			paramSerializer: '$httpParamSerializerJQLike',
		});
	}

	get(id: number, params?: { string: string }) {
		return this.$http.get(this.apiRoot + '/' + id, { params });
	}

	save(data: any) {
		return this.$http.post(this.apiRoot, data);
	}

	update(data: any) {
		return this.$http.put(this.apiRoot + '/' + data.id, data);
	}

	remove(data: any) {
		return this.$http.delete(this.apiRoot + '/' + data.id);
	}
}
