// @ts-ignore
import template from './view-modal.html';
import type ng from 'angular';
import type { Product } from '../products/Product';
import type { Localized } from '../../../types';
declare const localized: Localized;

interface ModalScope extends ng.IScope {
	editable: boolean;
	isBusy: boolean;
	product: Product;
	handleUpdate: (product: Product) => void;
	handleCancel: () => void;
}

export class ViewModalService {
	static $inject = ['$http', '$uibModal'];
	constructor(
		private $http: ng.IHttpService,
		private $uibModal: ng.ui.bootstrap.IModalService
	) {}

	show(callback: () => void, product: Product) {
		this.$uibModal
			.open({
				template,
				size: 'lg',
				controller: [
					'$scope',
					'$uibModalInstance',
					(
						$scope: ModalScope,
						$uibModalInstance: ng.ui.bootstrap.IModalInstanceService
					) => {
						$scope.product = product;
						$scope.editable = false;
						$scope.priceIndex = 0;
						if ($scope.product.pricesheets?.length) {
							$scope.priceSheet =
								$scope.product.pricesheets[
									$scope.priceIndex
								].price_sheet_id;
						}

						$scope.handleCancel = () => {
							$uibModalInstance.dismiss();
						};

						$scope.handleUpdate = (product: Product) => {
							update(product);
						};

						const update = (product: Product) => {
							$scope.isBusy = true;
							const url = `${localized.apiURL}/admin/products/${product.product_id}`;

							this.$http.put(url, product).then((response) => {
								$uibModalInstance.close();
								$scope.isBusy = false;
							});
						};

						$scope.changePricesheet = () => {
							$scope.priceIndex = $scope.product.pricesheets
								.map((e: any) => e.price_sheet_id)
								.indexOf($scope.priceSheet);
						};
					},
				],
			})
			.result.then(
				(results) => {
					callback.confirm(results);
				},
				() => {
					callback.cancel();
				}
			);
	}
}
