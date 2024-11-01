import template from './billing-page.component.html';

export const BillingPage: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'$state',
	'$stateParams',
	'Admin',
	'Tenant',
	'ConfirmModal',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
];

function controller(
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Tenant: any,
	ConfirmModal: any,
	Settings: any,
	Debug: any,
	Utils: any,
	Localized: any
) {
	/**
	 * Initialization
	 */
	this.$onInit = () => {
		this.breadcrumbs = [
			{
				label: 'VendorFuel Subscription',
				state: 'billing',
			},
		];

		$scope.activeTab = parseInt($stateParams.activeTab);
		$scope.isAuthed = Admin.Authed();
		$scope.loading = true;
		$scope.loadedWallet = false;
		$scope.loadingWallet = false;
		$scope.localized = Localized;
		$scope.saved = false;
		$scope.saving = false;
		$scope.settings = Settings;
		$scope.tenant = Tenant;
		$scope.walletUrl = null;
		$scope.utils = Utils;

		if ($stateParams.id) {
			updateBilling($stateParams.id);
		}

		loadBillingSettings();

		window.addEventListener(
			'message',
			(event) => {
				if (
					event.origin === 'https://api.vendorfuel.com' ||
					event.origin === 'https://dev.vendorfuel.com'
				) {
					const timer = setInterval(() => {
						clearInterval(timer);
						$scope.walletUrl = null;
						loadBillingSettings();
					}, 3000);
				}
			},
			false
		);
	};

	/**
	 * @param {number} id Billing ID
	 */
	function updateBilling(id: number) {
		Settings.billing.saved.cardId = id;
		delete Settings.billing.saved.card;
		const req = {
			method: 'POST',
			url: localized.apiURL + '/tenant/billing/update',
			data: Settings.billing.saved,
		};

		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					Debug.log(resp);
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	}

	$scope.retrieveWalletUrl = () => {
		if (!$scope.loadingWallet && !$scope.loadedWallet) {
			$scope.loadingWallet = true;
			$scope.loadedWallet = false;

			const req = {
				method: 'GET',
				url: localized.apiURL + '/tenant/billing/wallet/url',
				params: {
					return_url: localized.apiURL + '/tenant/PayFabricReturn/',
				},
			};
			Utils.getHttpPromise(req)
				.then(
					(resp: any) => {
						$scope.walletUrl = resp.url;
						$scope.loadedWallet = true;
					},
					(errResp: Error) => {
						Debug.error(errResp);
					}
				)
				.finally(() => {
					$scope.loadingWallet = false;
				});
		}
	};

	$scope.LoginCallback = () => {
		$scope.loading = true;
		loadBillingSettings();
	};

	$scope.TransitionState = () => {
		$state.go('settings');
	};

	$scope.SubmitUpdate = (i: any, form: any) => {
		$scope.UpdateBillingSettings(form);
	};

	/**
	 * @param {any} tab Tab
	 * @return {Object} Promise
	 */
	function getSettings(tab: any) {
		const promise = tab.Get().then(
			() => {
				$scope.loading = false;
			},
			function errorCallback() {
				$scope.loading = false;
			}
		);
		return promise;
	}
	/**
	 * @param {any}    tab  Tab
	 * @param {Object} form Form data
	 * @return {Object} Promise
	 */
	function updateSettings(tab: any, form: any) {
		Settings.errors = {};
		$scope.saving = true;
		$scope.saved = false;
		$scope.cancelled = false;
		const promise = tab.Set().then(
			() => {
				$scope.saving = false;
				$scope.saved = Object.keys(Settings.errors).length === 0;
				form.$setPristine();
				form.$setUntouched();
			},
			() => {
				$scope.saving = false;
			}
		);
		return promise;
	}
	$scope.LoadGatewaysSettings = () => {
		$scope.loading = true;
		if (Admin.Authed()) {
			getSettings(Settings.gateways);
		} else {
			$scope.loading = false;
		}
	};

	/**
	 * @param {any} r ?
	 */
	function loadBillingSettings(r?: boolean) {
		if (!r) {
			r = false;
		}
		$scope.loading = true;
		if ($scope.tenant.Authed()) {
			getSettings(Settings.billing);
		} else {
			$scope.loading = false;
		}
	}

	$scope.UpdateGeneralSettings = (form: any) => {
		if (
			Settings.general.saved.api_url === '' ||
			Settings.general.saved.api_key === ''
		) {
			Admin.Logout();
		}
		updateSettings(Settings.general, form);
	};
	$scope.UpdateConversionsSettings = (form: any) => {
		updateSettings(Settings.conversions, form);
	};
	$scope.UpdateImageSettings = (form: any) => {
		updateSettings(Settings.image, form);
	};
	$scope.UpdateGatewaysSettings = (form: any) => {
		updateSettings(Settings.gateways, form);
	};
	$scope.UpdateBillingSettings = (form: any) => {
		updateSettings(Settings.billing, form).then(() => {
			getSettings(Settings.billing);
		});
	};
	$scope.CancelSubscription = () => {
		$scope.saving = true;
		$scope.saved = false;
		$scope.cancelled = false;
		Settings.billing.cancelling = true;
		Settings.billing.Cancel().then(() => {
			getSettings(Settings.billing).then(() => {
				$scope.saving = false;
				if (Settings.billing.saved.status !== 'active') {
					$scope.cancelled = true;
					Settings.billing.cancelling = false;
				}
			});
		});
	};
	$scope.SubscriptionNotcancelled = () => {
		Debug.log('CANCELLATION NOT CONFIRMED!');
	};

	$scope.ConfirmCancelSubscription = () => {
		const callback = {
			confirm: $scope.DoubleCancellation,
			cancel: $scope.SubscriptionNotcancelled,
		};
		ConfirmModal.Show(
			callback,
			'Are you sure you want to cancel your subscription?',
			'If there is anything we can do to change your mind please let us know.',
			'No',
			'Yes'
		);
	};
	$scope.DoubleCancellation = () => {
		const callback = {
			confirm: $scope.CancelSubscription,
			cancel: $scope.SubscriptionNotcancelled,
		};
		ConfirmModal.Show(
			callback,
			'Are you absolutely sure?',
			'We will be sorry to see you go...',
			'No',
			'Yes'
		);
	};
}
