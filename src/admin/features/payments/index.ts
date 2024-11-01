import angular, { IScope } from 'angular';
import template from './index.template.html';

interface Scope extends IScope {
	template: unknown;
	gateways: unknown;
	getGateways(): void;
}

export const PaymentsPage: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$filter',
	'$scope',
	'Debug',
	'Utils',
	'Localized',
];

function controller(
	$http: ng.IHttpService,
	$filter: ng.IFilterService,
	$scope: Scope,
	Debug: any,
	Utils: any,
	Localized: any
) {
	const baseUrl = `${localized.apiURL}/admin/gateways/`;
	this.isBusy = false;
	this.templates = [
		{
			name: 'Qualpay',
			url: localized.dir.url + '/assets/templates/QualPay.html',
		},
		{
			name: 'AuthorizeNet',
			url: localized.dir.url + '/assets/templates/AuthorizeNet.html',
		},
		{
			name: 'PayPal',
			url: localized.dir.url + '/assets/templates/PayPal.html',
		},
		{
			name: 'PayFabric',
			url: localized.dir.url + '/assets/templates/PayFabric.html',
		},
		{
			name: 'Stripe',
			url: localized.dir.url + '/assets/templates/Stripe.html',
		},
		{
			name: 'SquareUp',
			url: localized.dir.url + '/assets/templates/SquareUp.html',
		},
	];
	this.template = this.templates[0]; // Must come after templates declaration.

	this.$onInit = () => {
		$scope.getGateways();
	};

	$scope.LoginCallback = () => {
		this.isBusy = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};

	$scope.getGateways = (): void => {
		this.isBusy = true;
		const url = baseUrl;

		$http
			.get(url)
			.then((response) => response.data)
			.then((responseData: { gateways?: unknown; errors?: string[] }) => {
				if (responseData.gateways) {
					$scope.gateways = responseData.gateways;
					angular.forEach($scope.gateways, (value, key) => {
						if (value.enabled && value.enabled !== 0) {
							this.template = $filter('filter')(this.templates, {
								name: key,
							})[0];
						}
					});
				} else if (responseData.errors.length > 0) {
					this.error = responseData.errors[0];
					this.hasError = true;
				}
			})
			.finally(() => {
				this.isBusy = false;
			});
	};

	$scope.disableGateway = (gateway: any) => {
		const data = {
			gateways: gateway,
		};
		const req = {
			method: 'PUT',
			url: baseUrl,
			data,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {
					if ('paypal' in gateway) {
						Utils.httpDelete(
							Localized.wpRestUrl + '/settings/paypal',
							{},
							{
								paypal_client_id: gateway.paypal.client_id,
							}
						);
					}

					if ('authnet' in gateway) {
						Utils.httpDelete(
							Localized.wpRestUrl + '/settings/authnet',
							{},
							{
								public_key: gateway.authnet.key,
								id: gateway.authnet.id,
							}
						);
					}

					if ('stripe' in gateway) {
						Utils.httpDelete(
							Localized.wpRestUrl + '/settings/stripe',
							{},
							{
								stripe_pk: gateway.stripe.publishableKey,
							}
						);
					}

					if ('squareup' in gateway) {
						Utils.httpDelete(
							Localized.wpRestUrl + '/settings/squareup',
							{},
							{
								location_id: gateway.squareup.locationID,
							}
						);
					}

					Utils.httpPut(
						Localized.wpRestUrl + '/payment/enabled',
						{},
						{
							gateway,
						}
					);
				},
				(errResp: any) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.isBusy = false;
				$scope.getGateways();
			});
	};

	$scope.updateGateway = (gateway: any) => {
		const data = {
			gateways: gateway,
		};
		const req = {
			method: 'PUT',
			url: baseUrl,
			data,
		};
		Utils.getHttpPromise(req)
			.then(
				() => {
					if ('paypal' in gateway) {
						Utils.httpPut(
							Localized.wpRestUrl + '/settings/paypal',
							{},
							{
								paypal_client_id: gateway.paypal.client_id,
							}
						);
					}

					if ('authnet' in gateway) {
						Utils.httpPut(
							Localized.wpRestUrl + '/settings/authnet',
							{},
							{
								public_key: gateway.authnet.key,
								id: gateway.authnet.id,
							}
						);
					}

					if ('stripe' in gateway) {
						Utils.httpPut(
							Localized.wpRestUrl + '/settings/stripe',
							{},
							{
								stripe_pk: gateway.stripe.publishableKey,
							}
						);
					}

					if ('squareup' in gateway) {
						Utils.httpPut(
							Localized.wpRestUrl + '/settings/squareup',
							{},
							{
								location_id: gateway.squareup.locationID,
							}
						);
					}

					Utils.httpPut(
						Localized.wpRestUrl + '/payment/enabled',
						{},
						{
							gateway,
						}
					);
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.isBusy = false;
			});
	};

	$scope.authorizeAccess = (processorIndex: number) => {
		this.isBusy = true;
		const req = {
			method: 'GET',
			url:
				localized.apiURL +
				'/admin/payments/' +
				processorIndex +
				'/authorize',
		};

		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					window.open(resp.auth_url, '_blank');
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.isBusy = false;
			});
	};

	$scope.revokeAccess = (processorIndex: number) => {
		this.isBusy = true;
		const req = {
			method: 'GET',
			url:
				localized.apiURL +
				'/admin/payments/' +
				processorIndex +
				'/revoke',
		};

		Utils.getHttpPromise(req)
			.then(
				() => {
					//window.open(resp.auth_url,'_blank');
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.isBusy = false;
			});
	};
}
