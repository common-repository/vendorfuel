const template = `
<div class="modal-header">
  <h4><strong ng-bind-html="modalTitle"></strong></h4>
</div>
<div class="modal-body">
  <img ng-if="modalImg" ng-src="{{modalImg}}" />
  <label for="code" class="form-label">Authenticator Code</label>
  <input id="code" class="form-control"
    type="text"
    ng-model="callbackParams.code_2fa"
  />
  <p compile-html="modalMessage"></p>
</div>
<div class="modal-footer">
  <button
    ng-class="highlightedButton == 0 ? 'btn btn-primary' : 'btn btn-outline-primary'"
    ng-style="width: {{optionWidth}}px"
    ng-click="Cancel()"
  >
    {{optionCancel}}
  </button>
  <button
    ng-class="highlightedButton == 1 ? 'btn btn-primary' : 'btn btn-outline-primary'"
    ng-style="width: {{optionWidth}}px"
    ng-click="Confirm()"
  >
    {{optionConfirm}}
  </button>
</div>
`;

twoFactorModalFactory.$inject = ['$uibModal', '$sce'];

export function twoFactorModalFactory(
	$uibModal: ng.ui.bootstrap.IModalService,
	$sce: ng.ISCEService
) {
	const service = {
		Show(
			callback: any,
			title: any,
			message: any,
			optionCancel: any,
			optionConfirm: any,
			backdrop: boolean,
			highlightedButton: number
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
