import template from './payfabric-return.component.html';

/**
 * PayFabric error result codes
 *
 * These codes may appear in the ResultCode parameter from PayFabric. Not to be confused with the PayFabricErrorCode which provides a more general error.
 *
 * @see https://github.com/PayFabric/Portal/blob/master/PayFabric/Sections/PayFabric%20Error%20Codes.md
 */
const declineCodes: number[] = [
	2, 5, 6, 8, 12, 14, 38, 101, 102, 103, 104, 115, 117, 119, 126,
];

export const PayfabricReturn: ng.IComponentOptions = {
	controller: class Controller {
		static $inject = [
			'$location',
			'$rootScope',
			'$timeout',
			'Alerts',
			'Cart',
			'Utils',
		];
		hasError: boolean;
		isBusy: boolean = false;
		isDeclined: boolean;
		message: string;
		orderId: number;
		responseMessage: string;
		returnUrl: string;
		search: { [key: string]: string };
		resultCode: number;

		constructor(
			private $location: ng.ILocationService,
			private $rootScope: ng.IRootScopeService,
			private $timeout: ng.ITimeoutService,
			private Alerts: unknown,
			private Cart: unknown,
			private Utils: unknown
		) {
			this.message = 'Completing order, please wait...';
		}

		$onInit() {
			this.orderId = Number(this.$location.search().OrderID);
			this.resultCode = Number(this.$location.search().ResultCode);
			this.returnUrl = `https://${window.location.hostname}/cc-return/?OrderID=${this.orderId}`;

			const errorCode = this.$location.search().PayFabricErrorCode;
			const params = {
				trx_key: this.$location.search().TrxKey,
				order_id: this.orderId,
				payment_method: 'payfabric',
			};
			const responseMsg = this.$location.search().ResponseMsg;

			if (declineCodes.includes(this.resultCode)) {
				this.handleDecline();
			} else if (errorCode) {
				this.handleError(responseMsg);
			} else {
				this.handleSuccess(params);
			}
		}

		/**
		 * Prevents the user from navigating away from the page without a warning.
		 */
		disableNavWarning() {
			// Needs to disable on the window parent since the Payfabric return is within an iframe.
			window.parent.onbeforeunload = null;
		}

		handleRetry() {
			this.isBusy = true;
			this.Cart.payfabricUrl(this.returnUrl, this.orderId).then(
				(response) => {
					this.$rootScope.payfabric_url = response;
					parent.document.getElementById('payfabricFrame').src =
						response;
				}
			);
		}

		handleDecline() {
			this.isDeclined = true;
		}

		handleError(responseMsg: string) {
			this.hasError = true;
			this.responseMessage = responseMsg;
		}

		handleSuccess(params: {
			trx_key: string;
			order_id: number;
			payment_method: string;
		}) {
			this.message =
				'Completing order, please wait and do not refresh page...';
			this.Cart.completeOrder(params)
				.then((response) => {
					if (response.data.errors.length < 1) {
						this.disableNavWarning();

						if (response.data.pending === 1) {
							this.message =
								'Order is pending approval. Redirecting to welcome page.';
							this.$timeout(() => {
								top.location.href =
									this.Utils.getPageUrl('welcome');
							}, 3000);
						} else {
							this.message =
								'Order completed. Redirecting to view order page.';
							top.location.href = `${this.Utils.getPageUrl(
								'view-order'
							)}?id=${response.data.order_id}`;
						}
					}
				})
				.catch((reject) => {
					console.error('rejected', reject);
				});
		}
	},
	template,
};
