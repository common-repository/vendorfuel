import template from './payments-page.component.html';

export const PaymentsPage: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$filter',
	'$scope',
	'Admin',
	'Debug',
	'Utils',
	'Localized',
];

function controller(
	$filter: ng.IFilterService,
	$scope: ng.IScope,
	Admin: any,
	Debug: any,
	Utils: any,
	Localized: any
) {
	this.$onInit = () => {
		$scope.addParams = {};
		$scope.gateway = {};
		$scope.gateways = [];
		$scope.gatewaysEndpoint = localized.apiURL + '/admin/gateways/';
		$scope.isAuthed = Admin.Authed();
		$scope.loading = false;
		$scope.rppValues = [15, 30, 50, 100];
		$scope.searchParams = {
			q: '',
			sortBy: '',
			sortType: '',
			rpp: $scope.rppValues[0],
		};
		$scope.selectedGateway = null;
		$scope.templates = [
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
		$scope.template = $scope.templates[0]; // Must come after templates declaration.
		$scope.retrieveGateways();
	};

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};

	$scope.retrieveGateways = () => {
		$scope.loading = true;
		const req = {
			method: 'GET',
			url: $scope.gatewaysEndpoint,
		};

		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.gateways = resp.gateways;
					angular.forEach($scope.gateways, (value, key) => {
						if (value.enabled && value.enabled !== 0) {
							$scope.template = $filter('filter')(
								$scope.templates,
								{ name: key }
							)[0];
						}
					});
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	$scope.disableGateway = (gateway: any) => {
		const data = {
			gateways: gateway,
		};
		const req = {
			method: 'PUT',
			url: $scope.gatewaysEndpoint,
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
				$scope.loading = false;
				$scope.retrieveGateways();
			});
	};

	$scope.updateGateway = (gateway: any) => {
		const data = {
			gateways: gateway,
		};
		const req = {
			method: 'PUT',
			url: $scope.gatewaysEndpoint,
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
				$scope.loading = false;
			});
	};

	$scope.authorizeAccess = (processorIndex: number) => {
		$scope.loading = true;
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
				$scope.loading = false;
			});
	};

	$scope.revokeAccess = (processorIndex: number) => {
		$scope.loading = true;
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
				$scope.loading = false;
			});
	};
}
