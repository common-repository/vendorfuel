import template from './search-modal.template.html';
searchModalFactory.$inject = ['$uibModal', 'RelationshipSearch'];

export function searchModalFactory(
	$uibModal: ng.ui.bootstrap.IModalService,
	RelationshipSearch: any
) {
	const service = {
		Show(
			callback: any,
			title: string,
			pageConfig: any,
			message: any,
			optionCancel: any,
			optionConfirm: any,
			backdrop: any
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
						(
							$scope: ng.IScope,
							$uibModalInstance: ng.ui.bootstrap.IModalInstanceService
						) => {
							$scope.relationshipSearch = RelationshipSearch; //Service containing the main functionality for searching and matching relationships
							$scope.modalTitle = title;
							$scope.modalMessage = message;
							$scope.optionCancel = optionCancel;
							$scope.optionConfirm = optionConfirm;
							$scope.optionWidth = optionWidth;
							$scope.pageConfig = pageConfig;
							$scope.removedIds = [];
							$scope.removedObjs = [];
							$scope.addedIds = [];
							$scope.addedObjs = [];
							$scope.deselectedIds = [];
							$scope.deselectedObjs = [];
							$scope.unselectedIds = [];
							$scope.unselectedObjs = [];
							$scope.loading = true;
							$scope.filterBy = ['Search For', 'Search For'];
							$scope.rppValues = [15, 30, 50, 100];
							$scope.per_page = [
								$scope.rppValues[0],
								$scope.rppValues[0],
							];
							$scope.tab = 0;
							$scope.hasOneTab = false;
							if (pageConfig.tabs.length === 1) {
								$scope.hasOneTab = true;
							}
							$scope.results = [[], []];
							$scope.rawResults = [[], []];
							$scope.pagination = [];

							$scope.TabChanged = (i: number) => {
								$scope.tab = i;
							};
							$scope.selectItem = (
								index: number,
								tab: number
							) => {
								const id =
									$scope.rawResults[tab][index][
										pageConfig.tabs[tab].id
									];
								if (tab === 0) {
									if (pageConfig.tabs[0].selectOne) {
										if ($scope.addedIds.length) {
											if ($scope.addedIds.includes(id)) {
												const i =
													$scope.addedIds.indexOf(id);
												$scope.addedIds.splice(i, 1);
												$scope.addedObjs.splice(i, 1);
											} else {
												const j =
													$scope.addedIds.indexOf(id);
												$scope.addedIds.splice(j, 1);
												$scope.addedObjs.splice(j, 1);
												$scope.addedIds.push(id);
												$scope.addedObjs.push(
													$scope.rawResults[tab][
														index
													]
												);
											}
										} else {
											$scope.addedIds.push(id);
											$scope.addedObjs.push(
												$scope.rawResults[tab][index]
											);
										}
									} else if ($scope.addedIds.includes(id)) {
										const k = $scope.addedIds.indexOf(id);
										$scope.addedIds.splice(k, 1);
										$scope.addedObjs.splice(k, 1);
										$scope.unselectedIds.push(id);
										$scope.unselectedObjs.push(
											$scope.rawResults[tab][index]
										);
									} else {
										if ($scope.unselectedIds.includes(id)) {
											const l =
												$scope.deselectedIds.indexOf(
													id
												);
											$scope.unselectedIds.splice(l, 1);
											$scope.unselectedObjs.splice(l, 1);
										}
										$scope.addedIds.push(id);
										$scope.addedObjs.push(
											$scope.rawResults[tab][index]
										);
									}
								}
								if (tab === 1) {
									if ($scope.removedIds.includes(id)) {
										const q = $scope.removedIds.indexOf(id);
										$scope.removedIds.splice(q, 1);
										$scope.removedObjs.splice(q, 1);
										$scope.deselectedIds.push(id);
										$scope.deselectedObjs.push(
											$scope.rawResults[tab][index]
										);
									} else {
										if ($scope.deselectedIds.includes(id)) {
											const r =
												$scope.deselectedIds.indexOf(
													id
												);
											$scope.deselectedIds.splice(r, 1);
											$scope.deselectedObjs.splice(r, 1);
										}
										$scope.removedIds.push(id);
										$scope.removedObjs.push(
											$scope.rawResults[tab][index]
										);
									}
								}
							};
							$scope.Init = () => {
								const total = pageConfig.tabs.length;
								let done = 0;
								if (pageConfig.updatedItems) {
									for (
										let i = 0;
										i < pageConfig.updatedItems.length;
										i++
									) {
										if (
											pageConfig.updatedItems[i]
												.action === 'add'
										) {
											$scope.addedIds.push(
												pageConfig.updatedItems[i]
													.value[
													pageConfig.tabs[0].id
												]
											);
											$scope.addedObjs.push(
												pageConfig.updatedItems[i].value
											);
										}
										if (
											pageConfig.updatedItems[i]
												.action === 'remove' &&
											!$scope.hasOneTab
										) {
											$scope.removedIds.push(
												pageConfig.updatedItems[i]
													.value[
													pageConfig.tabs[0].id
												]
											);
											$scope.removedObjs.push(
												pageConfig.updatedItems[i].value
											);
										}
									}
								}
								$scope.relationshipSearch
									.Init(pageConfig.tabs[0].http)
									.then((resp: any) => {
										$scope.pagination[0] =
											resp[
												pageConfig.tabs[0].relationships[0]
											];
										resp[
											pageConfig.tabs[0].relationships[0]
										].data.forEach((val: any) => {
											$scope.rawResults[0].push(val);
											$scope.results[0].push(
												$scope.relationshipSearch.ProcessResults(
													0,
													pageConfig,
													val
												)
											);
										});
									})
									.finally(() => {
										if (++done >= total) {
											$scope.loading = false;
										}
									});
								if (!$scope.hasOneTab) {
									$scope.relationshipSearch
										.Init(pageConfig.tabs[1].http)
										.then((resp: any) => {
											$scope.pagination[1] =
												resp[
													pageConfig.tabs[1].relationships[0]
												][
													pageConfig.tabs[1].relationships[1]
												];
											resp[
												pageConfig.tabs[1]
													.relationships[0]
											][
												pageConfig.tabs[1]
													.relationships[1]
											].data.forEach((val: any) => {
												$scope.rawResults[1].push(val);
												$scope.results[1].push(
													$scope.relationshipSearch.ProcessResults(
														1,
														pageConfig,
														val
													)
												);
											});
										})
										.finally(() => {
											if (++done >= total) {
												$scope.loading = false;
											}
										});
								}
							};
							$scope.Cancel = () => {
								$uibModalInstance.dismiss();
							};
							$scope.Confirm = () => {
								const callbackResults = [];
								if ($scope.removedObjs.length) {
									for (
										let i = 0;
										i < $scope.removedObjs.length;
										i++
									) {
										callbackResults.push({
											action: 'remove',
											value: $scope.removedObjs[i],
										});
									}
								}
								if ($scope.addedObjs.length) {
									for (
										let j = 0;
										j < $scope.addedObjs.length;
										j++
									) {
										callbackResults.push({
											action: 'add',
											value: $scope.addedObjs[j],
										});
									}
								}
								if ($scope.unselectedObjs.length) {
									for (
										let k = 0;
										k < $scope.unselectedObjs.length;
										k++
									) {
										callbackResults.push({
											action: 'unselect',
											value: $scope.unselectedObjs[k],
										});
									}
								}
								if ($scope.deselectedObjs.length) {
									for (
										let l = 0;
										l < $scope.deselectedObjs.length;
										l++
									) {
										callbackResults.push({
											action: 'deselect',
											value: $scope.deselectedObjs[l],
										});
									}
								}

								$uibModalInstance.close(callbackResults);
							};
							$scope.Search = (page: number) => {
								$scope.loading = true;
								$scope.pageConfig.tabs[
									$scope.tab
								].http.params.page = page || 1;
								if (
									$scope.filterBy[$scope.tab] ===
									'Filter Results'
								) {
									$scope.pageConfig.tabs[
										$scope.tab
									].http.params.q = '';
								}
								$scope.relationshipSearch
									.Search(
										$scope.pageConfig.tabs[$scope.tab].http
									)
									.then((resp: any) => {
										if ($scope.tab === 0) {
											$scope.results[0] = [];
											$scope.rawResults[0] = [];
											$scope.pagination[0] =
												resp[
													pageConfig.tabs[0].relationships[0]
												];
											resp[
												pageConfig.tabs[0]
													.relationships[0]
											].data.forEach((val: any) => {
												$scope.rawResults[0].push(val);
												$scope.results[0].push(
													$scope.relationshipSearch.ProcessResults(
														0,
														pageConfig,
														val
													)
												);
											});
										} else {
											$scope.results[1] = [];
											$scope.rawResults[1] = [];
											$scope.pagination[1] =
												resp[
													pageConfig.tabs[1].relationships[0]
												][
													pageConfig.tabs[1].relationships[1]
												];
											resp[
												pageConfig.tabs[1]
													.relationships[0]
											][
												pageConfig.tabs[1]
													.relationships[1]
											].data.forEach((val: any) => {
												$scope.rawResults[1].push(val);
												$scope.results[1].push(
													$scope.relationshipSearch.ProcessResults(
														1,
														pageConfig,
														val
													)
												);
											});
										}
									})
									.finally(() => {
										$scope.loading = false;
									});
							};
							$scope.Init();
						},
					],
				})
				.result.then(
					(resp) => {
						callback.confirm(resp);
					},
					() => {
						callback.cancel();
					}
				);
		},
	};
	return service;
}
