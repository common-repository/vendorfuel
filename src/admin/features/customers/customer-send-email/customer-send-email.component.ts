import template from "./customer-send-email.html";

export const CustomerEmailComponent: ng.IComponentOptions = {
  bindings: {
    customerId: "<",
    emailType: "@",
  },
  template,
  controller: class CustomerEmailsController {
    static $inject: string[] = ["CustomerEmailService"];

    customerId: number;
    isLoading: boolean;
    emailType: "register" | "verified";

    constructor(private CustomerEmailService: any) {}

    send() {
      this.isLoading = true;
      this.CustomerEmailService.send(this.customerId, this.emailType).then(
        () => {
          this.isLoading = false;
        }
      );
    }
  },
};
