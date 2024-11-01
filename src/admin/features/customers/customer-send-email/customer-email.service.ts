export class CustomerEmailService {
  static $inject: string[] = ["$http", "Localized"];

  private apiRoot = `${localized.apiURL}/admin/customers`;
  private $http: ng.IHttpService;
  private Localized: any;

  constructor($http: ng.IHttpService, Localized: any) {
    this.$http = $http;
    this.Localized = Localized;
  }

  send(id: number, type: "register" | "verified") {
    return this.$http
      .get(`${this.apiRoot}/${id}/email/${type}`)
      .then((response: { data: any }) => {
        this.Localized.setNotifications(response.data);

        if (!response.data.errors.length) {
          return response.data;
        }
      });
  }
}
