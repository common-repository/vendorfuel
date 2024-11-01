import template from './reports-page.component.html';
import type { Localized } from '../../types';
declare const angular: ng.IAngularStatic;
declare const localized: Localized;

export const ReportsPage: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = [
	'$http',
	'$scope',
	'Admin',
	'Reports',
	'Debug',
	'Settings',
	'Utils',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	Admin: any,
	Reports: any,
	Debug: any,
	Settings: any,
	Utils: any
) {
	this.nav = [
		{
			label: 'Downloadable reports',
			href: '?page=vf-admin#/reports/downloads',
		},
		{
			label: 'Schedule reports',
			href: '?page=vf-admin#/reports/schedule',
		},
	];

	this.$onInit = () => {
		$scope.allColumns = []; // Columns of all selected tables
		$scope.allTables = Reports.getAllTables();
		$scope.clear = true;
		$scope.comparators = Reports.getComparators();
		$scope.downloads = []; // List of downloaded reports
		$scope.filterOperators = ['OR', 'AND'];
		$scope.isAuthed = Admin.Authed();
		$scope.joinTypes = {
			standard: 'Standard',
			left: 'Left',
			right: 'Right',
		};
		$scope.loading = false;
		$scope.reportLoading = false;
		$scope.reportsEndpoint = localized.apiURL + '/admin/reports/';
		$scope.reportData = {};
		$scope.reportHeaders = [];
		$scope.rppValues = [15, 30, 50, 100];
		$scope.per_page = $scope.rppValues[0]; // Must be after rrpValues is defined.

		$scope.savedReports = []; // List of person/shared reports that were saved
		$scope.storeTables = Reports.getStoreTables();

		$scope.loading = true;
		Settings.errors = {};
		editReports();
	};

	const editReports = () => {
		const req = {
			method: 'GET',
			url: $scope.reportsEndpoint,
		};
		req.url += 'all';
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.savedReports = [];
					angular.forEach(resp.personal_reports, (value) => {
						$scope.savedReports.push(value);
					});
					angular.forEach(resp.shared_reports, (value) => {
						$scope.savedReports.push(value);
					});
					$scope.AssignReport(null);
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	this.addJoinRow = () => {
		const initJoin = $scope.allTables.admin_users[0];
		$scope.selectedParams.joinTable.push(initJoin.table);
		$scope.UpdateColumns(initJoin.table, '');
		$scope.selectedParams.joinSelect.push(initJoin.value);
		$scope.selectedParams.joinTerm.push('=');
		$scope.selectedParams.joinValue.push('');
		$scope.selectedParams.joinIsNested.push(false);
		$scope.selectedParams.joinType.push('standard');
	};

	this.addFilterRow = () => {
		if ($scope.selectedParams.filterSelect.push('') === 1) {
			$scope.selectedParams.filterToken.push('(', 'ex', ')');
		} else {
			$scope.selectedParams.filterToken.splice(
				$scope.selectedParams.filterToken.length - 1,
				0,
				'ex'
			);
		}
		$scope.selectedParams.filterTerm.push($scope.comparators[0]);
		$scope.selectedParams.filterValue.push('');
		$scope.selectedParams.filterOperator.push('OR');
	};

	$scope.AddGroupFilter = (index: number, type: string) => {
		const tokenGroup: any = ['(', 'ex', ')'];
		let exCount = 0;
		for (let i = 0; i < $scope.selectedParams.filterToken.length; i++) {
			if ($scope.selectedParams.filterToken[i] === 'ex') {
				if (index === exCount) {
					if (type === 'group') {
						$scope.selectedParams.filterToken.splice.apply(
							$scope.selectedParams.filterToken,
							[i + 1, 0].concat(tokenGroup)
						);
					} else {
						$scope.selectedParams.filterToken.splice(
							i + 1,
							0,
							'ex'
						);
					}
					break;
				}
				exCount++;
			}
		}
		$scope.selectedParams.filterSelect.splice(index + 1, 0, '');
		$scope.selectedParams.filterTerm.splice(
			index + 1,
			0,
			$scope.comparators[0]
		);
		$scope.selectedParams.filterValue.splice(index + 1, 0, '');
		$scope.selectedParams.filterOperator.splice(index + 1, 0, 'OR');
	};
	// Populate selectedParams object with selected saved report
	$scope.AssignReport = (selectedReport: any) => {
		// Reset report parameters
		// Parameters to use in request with the API
		$scope.clear = false;
		$scope.selectedParams = {};
		$scope.selectedParams.tables = [];
		$scope.selectedParams.headers = [];
		$scope.selectedParams.joinTable = [];
		$scope.selectedParams.joinSelect = [];
		$scope.selectedParams.joinTerm = [];
		$scope.selectedParams.joinValue = [];
		$scope.selectedParams.joinType = [];
		$scope.selectedParams.joinIsNested = [];
		$scope.selectedParams.filterSelect = [];
		$scope.selectedParams.filterTerm = [];
		$scope.selectedParams.filterValue = [];
		$scope.selectedParams.filterOperator = [];
		$scope.selectedParams.filterToken = [];
		$scope.selectedParams.groupBy = [];
		$scope.selectedParams.nestedQuery = []; // Only supported in the JOIN clause right now
		$scope.selectedParams.direction = 'asc';
		$scope.selectedParams.shared = false;
		$scope.allColumns = [];

		if (!selectedReport) {
			return;
		}

		$scope.selectedParams.tables.push(selectedReport.tables.value[0]);
		$scope.UpdateColumns($scope.selectedParams.tables[0], '');

		if (selectedReport.joins.table) {
			for (let i = 0; i < selectedReport.joins.table.length; i++) {
				$scope.selectedParams.joinTable[i] =
					selectedReport.joins.table[i];
				$scope.selectedParams.joinSelect[i] =
					selectedReport.joins.select[i];
				$scope.selectedParams.joinTerm[i] =
					selectedReport.joins.term[i];
				$scope.selectedParams.joinValue[i] =
					selectedReport.joins.value[i];
				$scope.selectedParams.joinType[i] =
					selectedReport.joins.type[i];
				$scope.selectedParams.joinIsNested[i] =
					selectedReport.joins.isNested[i];
				$scope.UpdateColumns($scope.selectedParams.joinTable[i], '');
			}
		}

		if (selectedReport.filters.select) {
			for (let j = 0; j < selectedReport.filters.select.length; j++) {
				$scope.selectedParams.filterSelect[j] =
					selectedReport.filters.select[j];
				$scope.selectedParams.filterTerm[j] =
					selectedReport.filters.term[j];
				$scope.selectedParams.filterValue[j] =
					selectedReport.filters.value[j];
				$scope.selectedParams.filterOperator[j] =
					selectedReport.filters.operator[j];
			}
			for (let l = 0; l < selectedReport.filters.token.length; l++) {
				$scope.selectedParams.filterToken[l] =
					selectedReport.filters.token[l];
			}
		}

		for (let p = 0; p < selectedReport.headers.value.length; p++) {
			$scope.selectedParams.headers[p] = selectedReport.headers.value[p];
		}

		$scope.selectedParams.shared = selectedReport.shared;
		$scope.selectedParams.report_id = selectedReport.id;
		$scope.selectedParams.order = selectedReport.order;
		$scope.selectedParams.direction = selectedReport.direction;
		$scope.selectedParams.name = selectedReport.name;
		$scope.selectedParams.frequency = selectedReport.frequency;
	};
	$scope.AssignReport(null);

	$scope.ClearReport = () => {
		$scope.reportData = {};
		$scope.AssignReport(null);
		$scope.clear = true;
	};

	this.destroyReport = (id: number) => {
		const url = `${localized.apiURL}/admin/reports/${id}`;
		$http
			.delete(url)
			.then(() => {
				$scope.TabChanged(0);
			})
			.catch((errResp: Error) => {
				Debug.error(errResp);
			})
			.finally(() => {
				$scope.loading = false;
			});
	};

	$scope.DownloadReport = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.reportsEndpoint + 'export',
			data: $scope.selectedParams,
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
				$scope.loading = false;
			});
	};
	$scope.GroupNumber = (index: number) => {
		let exCount = 0;
		let depth = 0;
		for (let i = 0; i < $scope.selectedParams.filterToken.length; i++) {
			if ($scope.selectedParams.filterToken[i] === '(') {
				depth++;
			}
			if ($scope.selectedParams.filterToken[i] === ')') {
				depth--;
			}
			if ($scope.selectedParams.filterToken[i] === 'ex') {
				if (index === exCount) {
					break;
				}
				exCount++;
			}
		}
		return depth - 1;
	};

	$scope.RemoveJoin = (index: number) => {
		$scope.selectedParams.joinSelect.splice(index, 1);
		$scope.selectedParams.joinTerm.splice(index, 1);
		$scope.selectedParams.joinValue.splice(index, 1);
		$scope.selectedParams.joinIsNested.splice(index, 1);
		$scope.selectedParams.joinType.splice(index, 1);
		const removedJoin = $scope.selectedParams.joinTable.splice(index, 1);
		$scope.UpdateColumns('', removedJoin[0]);
	};
	$scope.RemoveFilter = (index: number) => {
		let exCount = 0;
		for (let i = 0; i < $scope.selectedParams.filterToken.length; i++) {
			if ($scope.selectedParams.filterToken[i] === 'ex') {
				if (exCount === index) {
					let x = 1;
					while (
						$scope.selectedParams.filterToken[i - x] === '(' &&
						$scope.selectedParams.filterToken[i + x] === ')'
					) {
						$scope.selectedParams.filterToken[i - x] = ' ';
						$scope.selectedParams.filterToken[i + x] = ' ';
						x++;
					}
					$scope.selectedParams.filterToken[i] = ' ';
					break;
				}
				exCount++;
			}
		}
		for (
			let i = $scope.selectedParams.filterToken.length - 1;
			i >= 0;
			i--
		) {
			if ($scope.selectedParams.filterToken[i] === ' ') {
				$scope.selectedParams.filterToken.splice(i, 1);
			}
		}
		$scope.selectedParams.filterSelect.splice(index, 1);
		$scope.selectedParams.filterTerm.splice(index, 1);
		$scope.selectedParams.filterValue.splice(index, 1);
		$scope.selectedParams.filterOperator.splice(index, 1);
	};

	this.runReport = (rpp: number, page: number) => {
		$scope.reportRan = false;
		$scope.reportLoading = true;
		// $scope.loading = true;
		$scope.selectedParams.rpp = rpp;
		$scope.selectedParams.page = page;
		const req = {
			method: 'POST',
			url: $scope.reportsEndpoint + 'run',
			data: $scope.selectedParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.reportData = resp.results;
					if (
						resp.results &&
						resp.results.data &&
						resp.results.data.length
					) {
						$scope.reportHeaders = Object.keys(
							resp.results.data[0]
						);
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				// $scope.loading = false;
				$scope.reportLoading = false;
				$scope.reportRan = true;
			});
	};

	$scope.SaveReport = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.reportsEndpoint,
			data: $scope.selectedParams,
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
				$scope.loading = false;
			});
	};

	// Update table columns
	$scope.UpdateColumns = (newValue: string, oldValue: string) => {
		// If removing columns
		if (oldValue !== '') {
			// Check if table we're switching from is not selected on another table/join, else skip
			if (
				!$scope.selectedParams.tables.includes(oldValue) &&
				!$scope.selectedParams.joinTable.includes(oldValue)
			) {
				let i = $scope.allColumns.length;
				let found = false;
				while (i-- && !found) {
					// Find table we're switching from and remove from list
					if ($scope.allColumns[i].table === oldValue) {
						for (
							let j = 0;
							j < $scope.allTables[oldValue].length;
							j++
						) {
							$scope.allColumns.splice(i--, 1);
						}
						found = true;
					}
				}
			}
		}
		// If adding columns
		if (newValue !== '') {
			let tableExists = false,
				k = $scope.allColumns.length - 1;
			while (!tableExists && k >= 0) {
				// Check if new table/join is already in list
				if ($scope.allColumns[k].table === newValue) {
					tableExists = true;
				}
				k--;
			}
			if (!tableExists) {
				// If table not in list, add
				angular.forEach($scope.allTables[newValue], (value) => {
					$scope.allColumns.push(value);
				});
			}
		}
	};
	$scope.UpdateReport = (selectedReport: any) => {
		$scope.loading = true;
		const req = {
			method: 'PUT',
			url: $scope.reportsEndpoint + selectedReport.id,
			data: $scope.selectedParams,
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
				$scope.loading = false;
			});
	};
}
