export class CustomersService {
  static $inject: string[] = ["$http", "Localized"];

  private apiRoot = `${localized.apiURL}/admin/customers`;
  private $http: ng.IHttpService;
  private Localized: any;

  constructor($http: ng.IHttpService, Localized: any) {
    this.$http = $http;
    this.Localized = Localized;
  }

  copy(id: number, data: { email: string }) {
    return this.$http
      .post(`${this.apiRoot}/${id}/copy`, data)
      .then((response: { data: any }) => {
        this.Localized.setNotifications(response.data);
        return response.data;
      });
  }

  update(id: number, data: { content: string }) {
    return this.$http
      .put(`${this.apiRoot}/${id}`, data)
      .then((response: { data: any }) => {
        this.Localized.setNotifications(response.data);
        return response.data;
      });
  }
}
