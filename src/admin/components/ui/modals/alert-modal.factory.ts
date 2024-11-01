const template = `
	<div class="modal-header">
	<h4><strong ng-bind-html="modalTitle"></strong></h4>
	</div>
	<div class="modal-body">
	<p ng-bind-html="modalMessage" style="white-space: pre-wrap"></p>
	</div>
	<div class="modal-footer">
	<button
		ng-class="highlightedButton == 1 ? 'btn btn-primary' : 'btn-outline-primary'"
		ng-click="Confirm()"
	>
		{{optionConfirm}}
	</button>
	</div>
	`;

alertModalFactory.$inject = ['$uibModal', '$sce'];

export function alertModalFactory(
	$uibModal: ng.ui.bootstrap.IModalService,
	$sce: ng.ISCEService
) {
	const service = {
		Show(
			callback: any,
			title: string,
			message: any,
			optionConfirm: any,
			backdrop: any,
			highlightedButton: any
		) {
			message = message || '';
			optionConfirm = optionConfirm || 'Confirm';
			backdrop = backdrop || true;
			highlightedButton = highlightedButton || 0;
			const tempConfirmWidth = optionConfirm.length;
			const optionWidth = tempConfirmWidth * 9 + 24;
			const callbackParams = callback.params || {};
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
							$scope.modalTitle = $sce.trustAsHtml(title);
							$scope.modalMessage = $sce.trustAsHtml(message);
							$scope.optionConfirm = optionConfirm;
							$scope.optionWidth = optionWidth;
							$scope.highlightedButton = highlightedButton;
							$scope.Confirm = () => {
								$uibModalInstance.close();
							};
						},
					],
				})
				.result.then(
					() => {
						callback.confirm(callbackParams);
					},
					() => {
						callback.confirm(callbackParams);
					}
				);
		},
	};
	return service;
}
