import angular from 'angular';
import { toast } from 'react-toastify';
import template from './show.template.html';
import rmaTemplate from '../../features/orders/orders-detail/rma.html';
import shipmentTemplate from '../../features/orders/orders-detail/shipment.html';
import { usStates } from '../../data/usStates';
import { countries } from '../../data/countries';
import type { Localized } from '../../types';

declare const localized: Localized;

export const OrdersDetailComponent: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = [
	'$http',
	'$scope',
	'$state',
	'$stateParams',
	'$uibModal',
	'Admin',
	'Debug',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	$uibModal: ng.ui.bootstrap.IModalService,
	Admin: any,
	Debug: any
) {
	this.isBodyCopied = [];
	this.isResponseCopied = [];

	this.tabs = [
		{ label: 'Line Items', id: 'items' },
		{ label: 'Costs', id: 'costs' },
		{ label: 'Payments', id: 'payments' },
		{ label: 'Shipping & Billing', id: 'shipping-billing' },
		{ label: 'Additional Info', id: 'info' },
		{ label: 'Notifications', id: 'notifications' },
		{ label: 'Fraud', id: 'fraud' },
		{ label: 'Shipments', id: 'shipments' },
	];

	this.active = this.tabs[0].id;

	this.setActive = (id: string) => {
		this.active = id;
	};

	this.$onInit = () => {
		this.id = $stateParams.id || null;
		this.isLoading = true;
		this.order = {};

		this.breadcrumbs = [
			{ label: 'Orders', href: '?page=vendorfuel#!/orders' },
			{
				label: `Order ${this.id}`,
				href: `?page=vendorfuel#!/orders/${this.id}`,
			},
		];

		if (this.id) {
			this.getOrder();
		} else {
			$state.go('orders.index');
		}
	};

	this.copyToClipboard = (
		content: string,
		type: 'body' | 'response',
		index: number,
		e: Event
	) => {
		e.preventDefault();
		navigator.clipboard.writeText(content).then(
			() => {
				$scope.$apply(() => {
					this.isBodyCopied.fill(false);
					this.isResponseCopied.fill(false);
					if (type === 'body') {
						this.isBodyCopied[index] = true;
					} else {
						this.isResponseCopied[index] = true;
					}
				});
			},
			() => {
				toast.error('Could not copy to clipboard');
			}
		);
	};

	this.includesCosts = (order) => {
		if (order.lineItems) {
			return order.lineItems.some((item) => {
				return item.costs ? item.costs.length : false;
			});
		}
		return false;
	};

	this.includesNotificationDetails = (order) => {
		if (order.order_notifications) {
			return order.order_notifications.some(
				(item) => item.response || item.body
			);
		}
		return false;
	};

	this.includesPurchaseOrders = (order) => {
		if (order.lineItems) {
			return order.lineItems.some((item) => item.purchase_order);
		}
		return false;
	};

	/**
	 */
	this.getOrder = () => {
		this.isLoading = true;
		const url = `${localized.apiURL}/admin/orders/${this.id}`;

		$http.get(url).then((response: any) => {
			this.order = response.data.order;
			this.hasCosts = this.includesCosts(this.order);
			this.hasPurchaseOrders = this.includesPurchaseOrders(this.order);
			this.hasNotificationDetails = this.includesNotificationDetails(
				this.order
			);
			this.isLoading = false;
		});
	};

	this.getLineItemStatus = (item: {
		status: string;
		purchase_order: { status: string };
	}): string => {
		const allowList = ['accept', 'reject', 'backordered', 'sent'];
		if (
			item.purchase_order?.status &&
			allowList.includes(item.purchase_order.status)
		) {
			return item.purchase_order.status;
		}
		return item.status;
	};

	this.getNonUnderscored = (str: string): string => {
		return str.replace(/_/g, ' ');
	};

	/**
	 * @param {Object} item Product
	 */
	this.openRmaModal = (item: any) => {
		const order = this.order;
		$uibModal
			.open({
				template: rmaTemplate,
				size: 'lg',
				controller: [
					'$scope',
					'$uibModalInstance',
					(
						$scope: ng.IScope,
						$uibModalInstance: ng.ui.bootstrap.IModalInstanceService
					) => {
						$scope.order = order;
						$scope.item = item;
						if ($scope.item.return_request_date) {
							$scope.item.return_request_date = new Date(
								$scope.item.return_request_date
							);
						}

						$scope.returnStatuses = {
							none: 'No return requested',
							requested: 'Requested',
							denied: 'Denied',
							approved: 'Approved',
							refunded: 'Refunded',
							replaced: 'Replaced',
						};
						$scope.returnReasons = {
							defective: 'Defective',
							'wrong item': 'Wrong Item',
							exchange: 'Exchange',
							other: 'Other',
						};
						$scope.confirm = () => {
							this.isLoading = true;
							const req = {
								method: 'PUT',
								url:
									localized.apiURL +
									'/admin/rma/' +
									$scope.item.purch_id,
								data: $scope.item,
							};

							$http
								.put(req.url, req.data)
								.then(() => {
									$uibModalInstance.close();
								})
								.catch((error) => Debug.error(error))
								.finally(() => {
									this.isLoading = false;
								});
						};
						$scope.cancel = () => {
							$uibModalInstance.dismiss();
						};
					},
				],
			})
			.result.then(() => {
				this.getOrder();
			});
	};

	/**
	 */
	this.openShipmentModal = () => {
		const id = this.id;
		$uibModal
			.open({
				template: shipmentTemplate,
				size: 'lg',
				controller: [
					'$scope',
					'$uibModalInstance',
					(
						$scope: ng.IScope,
						$uibModalInstance: ng.ui.bootstrap.IModalInstanceService
					) => {
						$scope.isLoading = false;
						$scope.shipment = {
							order_id: id,
							country_code: 'US',
							country_phone_code: 1,
						};
						$scope.states = usStates;
						$scope.countries = countries;
						$scope.Confirm = () => {
							this.isLoading = true;
							const req = {
								method: 'POST',
								url:
									localized.apiURL +
									'/admin/order/shipment/add',
								data: $scope.shipment,
							};

							$http
								.post(req.url, req.data)
								.then(() => {
									$uibModalInstance.close();
									$scope.isLoading = false;
								})
								.catch((error) => Debug.error(error));
						};
						$scope.Cancel = () => {
							$uibModalInstance.dismiss();
						};
					},
				],
			})
			.result.then(() => {
				this.getOrder();
			});
	};

	/**
	 */
	this.resendToGP = () => {
		this.isResendingToGP = true;
		const req = {
			method: 'POST',
			url: localized.apiURL + '/admin/order/resend',
			data: {
				order_id: this.id,
			},
		};

		$http
			.post(req.url, req.data)
			.then((response) => response.data)
			.then((responseData) => {
				if (
					!responseData.errors.length &&
					!responseData.warnings.length
				) {
					this.getOrder();
				}
			})
			.catch((error) => Debug.error(error))
			.finally(() => {
				this.isResendingToGP = false;
			});
	};

	this.resendToClearSale = () => {
		this.isResending = true;
		const url = `${localized.apiURL}/admin/orders/${this.id}/fraud/clearsale/export`;
		$http.post(url, {}).then((response) => {
			this.isResending = false;
		});
	};

	/**
	 * Attempt to export to quickbooks
	 */
	this.exportToQuickbooks = () => {
		this.isExportingToQuickbooks = true;
		const req = {
			method: 'POST',
			url:
				localized.apiURL +
				'/admin/order/' +
				this.id +
				'/quickbooks/export',
		};

		$http
			.post(req.url, {})
			.then(() => {
				this.isExportingToQuickbooks = false;
			})
			.catch((error) => Debug.error(error));
	};

	this.resendEmail = () => {
		this.isResendingEmail = true;
		const req = {
			method: 'POST',
			url: localized.apiURL + '/admin/order/resend-email',
			data: {
				order_id: this.id,
			},
		};

		$http
			.post(req.url, req.data)
			.then(() => {
				this.isResendingEmail = false;
			})
			.catch((error) => Debug.error(error));
	};

	this.resendNotification = () => {
		this.isResendingNotification = true;
		const url = `${localized.apiURL}/admin/order/resend-email`;
		const data = {
			order_id: this.id,
			notifications: true,
		};

		$http.post(url, data).then((response) => {
			this.isResendingNotification = false;
		});
	};

	this.lockCosts = () => {
		this.isLoading = true;
		const req = {
			method: 'POST',
			url: localized.apiURL + '/admin/order/' + this.id + '/costs/lock',
			data: {
				costs: this.order.purchased_items,
			},
		};

		$http
			.post(req.url, req.data)
			.then(() => {
				this.isLoading = false;
			})
			.catch((error) => Debug.error(error));
	};

	this.generatePurchaseOrders = () => {
		this.isLoading = true;
		const req = {
			method: 'POST',
			url: localized.apiURL + '/admin/order/' + this.id + '/po/generate',
		};

		$http
			.post(req.url, {})
			.then(() => {
				this.isLoading = false;
			})
			.catch((error) => Debug.error(error));
	};

	/**
	 * @param {Object} purchaseOrder Purchase Order
	 */
	this.sendPurchaseOrder = (purchaseOrder: any) => {
		this.isLoading = true;
		const req = {
			method: 'POST',
			url:
				localized.apiURL +
				'/admin/order/' +
				purchaseOrder.order_id +
				'/po/' +
				purchaseOrder.id +
				'/transmit',
		};

		$http
			.post(req.url, {})
			.then((response) => response.data)
			.then((responseData) => {
				$scope.order = responseData.order;
			})
			.catch((error) => Debug.error(error))
			.finally(() => {
				this.isLoading = false;
			});
	};

	/**
	 * @param {Object} purchaseOrder Purchase Order
	 */
	this.downloadPurchaseOrder = (purchaseOrder: any) => {
		const url = `${localized.apiURL}/admin/order/${purchaseOrder.order_id}/po/${purchaseOrder.id}/download`;

		window.open(Admin.Download(url), '_blank');
	};

	this.refresh = () => {
		location.reload();
	};
}
