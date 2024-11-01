const template = `
	<div class="modal-header">
	<h4><strong ng-bind-html="modalTitle"></strong></h4>
	</div>
	<div class="modal-body">
	<p ng-bind-html="modalMessage"></p>
	</div>
	<div class="modal-footer">
	<div class="hstack gap-1">
		<button
		ng-class="highlightedButton == 0 ? 'btn btn-primary' : 'btn btn-outline-primary'"
		ng-click="Cancel()"
		>
		{{optionCancel}}
		</button>
		<button
		ng-class="highlightedButton == 1 ? 'btn btn-primary' : 'btn btn-outline-primary'"
		ng-click="Confirm()"
		>
		{{optionConfirm}}
		</button>
	</div>
	</div>
	`;

confirmModalFactory.$inject = ['$uibModal', '$sce'];

export function confirmModalFactory(
	$uibModal: ng.ui.bootstrap.IModalService,
	$sce: ng.ISCEService
) {
	const service = {
		Show(
			callback: any,
			title: string,
			message: any,
			optionCancel: any,
			optionConfirm: any,
			backdrop: any,
			highlightedButton: any
		) {
			message = message || '';
			optionCancel = optionCancel || 'Cancel';
			optionConfirm = optionConfirm || 'Confirm';
			backdrop = backdrop || true;
			highlightedButton = highlightedButton || 0;
			let optionWidth: number;
			const tempCancelWidth = optionCancel.length;
			const tempConfirmWidth = optionConfirm.length;
			if (tempCancelWidth > tempConfirmWidth) {
				optionWidth = tempCancelWidth * 9 + 24;
			} else {
				optionWidth = tempConfirmWidth * 9 + 24;
			}
			let callbackParams = callback.params || {};
			$uibModal
				.open({
					template,
					backdrop,
					controller: [
						'$scope',
						'$uibModalInstance',
						(
							$scope: ng.IScope,
							$uibModalInstance: ng.ui.bootstrap.IModalInstanceService
						) => {
							$scope.callbackParams = callbackParams;
							$scope.modalTitle = $sce.trustAsHtml(title);
							$scope.modalMessage = $sce.trustAsHtml(message);
							$scope.modalImg = callbackParams.imgSrc;
							$scope.optionCancel = optionCancel;
							$scope.optionConfirm = optionConfirm;
							$scope.optionWidth = optionWidth;
							$scope.highlightedButton = highlightedButton;
							$scope.Cancel = () => {
								$uibModalInstance.dismiss();
							};
							$scope.Confirm = () => {
								$uibModalInstance.close();
							};
							$scope.ApplyChangeToCallback = () => {
								callbackParams = $scope.callbackParams;
							};
						},
					],
				})
				.result.then(
					() => {
						if (callback.confirm) {
							callback.confirm(callbackParams);
						}
					},
					() => {
						if (callback.cancel) {
							callback.cancel(callbackParams);
						}
					}
				);
		},
	};
	return service;
}
