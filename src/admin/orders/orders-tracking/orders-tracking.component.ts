import angular from 'angular';
import template from './orders-tracking.component.html';

export const OrderTrackingComponent: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = ['$scope', 'Debug', 'Utils'];

function controller($scope: ng.IScope, Debug: any, Utils: any) {
	this.$onInit = () => {
		this.breadcrumbs = [
			{ label: 'Orders', href: '?page=vendorfuel#!/orders' },
			{
				label: 'Order Tracking',
				href: '?page=vendorfuel#!/orders/tracking',
			},
		];
		getLog();
	};

	const getLog = () => {
		this.isLoading = true;
		const endpoint = `${localized.apiURL}/admin/order/shipment/upload/log`;

		Utils.httpGet(endpoint)
			.then(
				(response: any) => {
					if (!response.errors.length) {
						this.log = response.log;
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.isLoading = false;
			});
	};

	/**
	 */
	$scope.setUploading = () => {
		$scope.$apply(() => {
			this.isUploading = !this.isUploading;
		});
	};

	/**
	 * @param {Object} element DOM element
	 */
	$scope.setFile = (element: HTMLFormElement) => {
		$scope.$apply(() => {
			this.theFile = element.files[0];
		});
		const fd = new FormData();
		fd.append('file', this.theFile);
		const req = {
			method: 'POST',
			url: localized.apiURL + '/admin/order/shipment/upload/zip',
			data: fd,
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined as undefined,
			},
		};
		Utils.getHttpPromise(req)
			.then(
				() => {
					angular.noop();
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.isUploading = false;
			});
	};
}
