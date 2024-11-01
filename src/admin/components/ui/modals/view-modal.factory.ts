const template = `
<div class="modal-header">
  <h4><strong ng-bind="modalTitle"></strong></h4>
  <button
    class="button"
    ng-click="editable = !editable"
    title="Changes made here will be published globally for your site."
  >
    Edit
  </button>
</div>
<div class="modal-body">
  <p ng-bind="modalMessage"></p>

  <div class="d-flex justify-content-center py-5" ng-show="loading">
    <div class="spinner is-active" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div class="row p-3" ng-show="!loading">
    <div class="col-sm-5">
	  <div class="text-center" ng-repeat="img in result.images" ng-if="$first">
		<img
		  class="img-fluid"
		  style="display: inline-block !important"
		  ng-src="{{img.small_url}}"
		/>
	  </div>
    </div>
    <div class="col-sm-7" ng-form name="form1">
      <div class="col p-0">
        <label for="desc" class="form-label">Name</label>
        <input
          class="form-control"
          id="desc"
          name="desc"
          ng-model="result.description"
          ng-disabled="!editable"
        />
      </div>
      <div class="row">
        <div class="col-sm-6">
          <label for="price-sheet" class="form-label">Price Sheet: </label>
          <select
            class="form-select"
            id="price-sheet"
            name="pricesheets"
            ng-change="changePricesheet()"
            ng-model="priceSheet"
            ng-options="ps.pricesheetindex.price_sheet_id as ps.pricesheetindex.sheet for ps in result.pricesheets"
            ng-disabled="!editable"
          ></select>
        </div>
        <div class="col-sm-6">
          <label for="price" class="form-label">Price: </label>
          <input
            class="form-control"
            id="price"
            name="price"
            ng-model="result.pricesheets[priceIndex].price"
            ng-disabled="!editable"
          />
        </div>
      </div>
      <div class="col-12 p-0">
        <div class="">
          <label for="status" class="form-label">Status: </label>
          <select
            class="form-select"
            id="status"
            name="status"
            ng-model="result.status"
            ng-disabled="!editable"
          >
            <option value="active" ng-selected="result.status === 'active'">
              Active
            </option>
            <option value="inactive" ng-selected="result.status === 'inactive'">
              Inactive
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="col mt-3" ng-form name="form2">
      <label for="longd" class="form-label">Long Description</label>
      <textarea
        maxlength="65535"
        class="form-control"
        name="longd"
        id="longd"
        ng-model="result.long_description"
        ng-disabled="!editable"
      ></textarea>
    </div>
  </div>
</div>
<div class="modal-footer">
  <button class="button me-1" ng-click="Cancel()">{{optionCancel}}</button>
  <button class="button button-primary" ng-click="Confirm()">
    {{optionConfirm}}
  </button>
</div>
`;

viewModalFactory.$inject = ['$uibModal', 'Utils'];

export function viewModalFactory(
	$uibModal: ng.ui.bootstrap.IModalService,
	Utils: any
) {
	const service = {
		Show(
			callback: any,
			title: any,
			dataSet: any,
			message: any,
			optionCancel: any,
			optionConfirm: any,
			backdrop: boolean
		) {
			message = message || '';
			optionCancel = optionCancel || 'Cancel';
			optionConfirm = optionConfirm || 'Confirm';
			backdrop = backdrop || true;
			let optionWidth: number;
			const tempCancelWidth = optionCancel.length;
			const tempConfirmWidth = optionConfirm.length;
			if (tempCancelWidth > tempConfirmWidth) {
				optionWidth = tempCancelWidth * 9 + 24;
			} else {
				optionWidth = tempConfirmWidth * 9 + 24;
			}
			$uibModal
				.open({
					template,
					backdrop,
					size: 'lg',
					controller: [
						'$scope',
						'$uibModalInstance',
						function modalController(
							$scope: any,
							$uibModalInstance: ng.ui.bootstrap.IModalInstanceService
						) {
							$scope.modalTitle = title;
							$scope.modalMessage = message;
							$scope.optionCancel = optionCancel;
							$scope.optionConfirm = optionConfirm;
							$scope.optionWidth = optionWidth;
							$scope.result = dataSet;
							$scope.loading = false;
							$scope.editable = false;
							$scope.priceIndex = 0;
							$scope.priceSheet =
								$scope.result.pricesheets[
									$scope.priceIndex
								].price_sheet_id;
							$scope.Cancel = function () {
								$uibModalInstance.dismiss();
							};
							$scope.Confirm = function () {
								if (
									$scope.form1.$dirty ||
									$scope.form2.$dirty
								) {
									$scope.loading = true;
									const req = {
										method: 'POST',
										url:
											localized.apiURL +
											'/admin/product/modify/',
										data: $scope.result,
									};
									Utils.getHttpPromise(req)
										.then(function () {
											$uibModalInstance.close();
										})
										.finally(function () {
											$scope.loading = false;
										});
								} else {
									$scope.Cancel();
								}
							};
							$scope.changePricesheet = function () {
								$scope.priceIndex = $scope.result.pricesheets
									.map(function (e: any) {
										return e.price_sheet_id;
									})
									.indexOf($scope.priceSheet);
							};
						},
					],
				})
				.result.then(
					function (results) {
						callback.confirm(results);
					},
					function () {
						callback.cancel();
					}
				);
		},
	};
	return service;
}
