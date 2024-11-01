import type { IScope } from 'angular';
import template from './confirm-modal.template.html';

interface Scope extends IScope {
	title: string;
	body: string;
	cancelButtonText: string;
	confirmButtonText: string;
	confirm(): void;
	cancel(): void;
}

export class ConfirmModalService {
	static $inject = ['$uibModal'];

	// eslint-disable-next-line no-useless-constructor
	constructor(private $uibModal: ng.ui.bootstrap.IModalService) {}

	show(
		callback: {
			confirm(): void;
			cancel(): void;
		},
		title: string,
		body: string,
		cancelButtonText: string = 'Cancel',
		confirmButtonText: string = 'Confirm'
	) {
		this.$uibModal
			.open({
				template,
				controller: [
					'$scope',
					'$uibModalInstance',
					(
						$scope: Scope,
						$uibModalInstance: ng.ui.bootstrap.IModalInstanceService
					) => {
						$scope.title = title;
						$scope.body = body;
						$scope.cancelButtonText = cancelButtonText;
						$scope.confirmButtonText = confirmButtonText;

						$scope.cancel = () => {
							$uibModalInstance.dismiss();
						};

						$scope.confirm = () => {
							$uibModalInstance.close();
						};
					},
				],
			})
			.result.then(
				() => {
					if (callback.confirm) {
						callback.confirm();
					}
				},
				() => {
					if (callback.cancel) {
						callback.cancel();
					}
				}
			);
	}
}
