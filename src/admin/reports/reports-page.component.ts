import angular from 'angular';
import template from './reports-page.component.html';
import type { Localized } from '../types';
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
	this.perPageOptions = [10, 25, 50, 100];
	this.perPage = this.perPageOptions[0];
	const baseURL = `${localized.apiURL}/admin/reports/`;

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
		this.reportLoading = false;
		this.reportData = {};
		this.reportHeaders = [];
		$scope.rppValues = [15, 30, 50, 100];
		$scope.per_page = $scope.rppValues[0]; // Must be after rrpValues is defined.

		$scope.savedReports = []; // List of person/shared reports that were saved
		$scope.storeTables = Reports.getStoreTables();

		$scope.loading = true;
		Settings.errors = {};
		editReports();
	};

	this.handlePageChange = (page: number) => {
		this.runReport(page);
	};

	this.handleRowsPerPageChange = () => {
		this.runReport();
	};

	const editReports = () => {
		const req = {
			method: 'GET',
			url: baseURL,
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
		this.selectedParams.joinTable.push(initJoin.table);
		$scope.UpdateColumns(initJoin.table, '');
		this.selectedParams.joinSelect.push(initJoin.value);
		this.selectedParams.joinTerm.push('=');
		this.selectedParams.joinValue.push('');
		this.selectedParams.joinIsNested.push(false);
		this.selectedParams.joinType.push('standard');
	};

	this.addFilterRow = () => {
		if (this.selectedParams.filterSelect.push('') === 1) {
			this.selectedParams.filterToken.push('(', 'ex', ')');
		} else {
			this.selectedParams.filterToken.splice(
				this.selectedParams.filterToken.length - 1,
				0,
				'ex'
			);
		}
		this.selectedParams.filterTerm.push($scope.comparators[0]);
		this.selectedParams.filterValue.push('');
		this.selectedParams.filterOperator.push('OR');
	};

	$scope.AddGroupFilter = (index: number, type: string) => {
		const tokenGroup: any = ['(', 'ex', ')'];
		let exCount = 0;
		for (let i = 0; i < this.selectedParams.filterToken.length; i++) {
			if (this.selectedParams.filterToken[i] === 'ex') {
				if (index === exCount) {
					if (type === 'group') {
						this.selectedParams.filterToken.splice.apply(
							this.selectedParams.filterToken,
							[i + 1, 0].concat(tokenGroup)
						);
					} else {
						this.selectedParams.filterToken.splice(i + 1, 0, 'ex');
					}
					break;
				}
				exCount++;
			}
		}
		this.selectedParams.filterSelect.splice(index + 1, 0, '');
		this.selectedParams.filterTerm.splice(
			index + 1,
			0,
			$scope.comparators[0]
		);
		this.selectedParams.filterValue.splice(index + 1, 0, '');
		this.selectedParams.filterOperator.splice(index + 1, 0, 'OR');
	};
	// Populate selectedParams object with selected saved report
	$scope.AssignReport = (selectedReport: any) => {
		// Reset report parameters
		// Parameters to use in request with the API
		$scope.clear = false;
		this.selectedParams = {};
		this.selectedParams.tables = [];
		this.selectedParams.headers = [];
		this.selectedParams.joinTable = [];
		this.selectedParams.joinSelect = [];
		this.selectedParams.joinTerm = [];
		this.selectedParams.joinValue = [];
		this.selectedParams.joinType = [];
		this.selectedParams.joinIsNested = [];
		this.selectedParams.filterSelect = [];
		this.selectedParams.filterTerm = [];
		this.selectedParams.filterValue = [];
		this.selectedParams.filterOperator = [];
		this.selectedParams.filterToken = [];
		this.selectedParams.groupBy = [];
		this.selectedParams.nestedQuery = []; // Only supported in the JOIN clause right now
		this.selectedParams.direction = 'asc';
		this.selectedParams.shared = false;
		$scope.allColumns = [];

		if (!selectedReport) {
			return;
		}

		this.selectedParams.tables.push(selectedReport.tables.value[0]);
		$scope.UpdateColumns(this.selectedParams.tables[0], '');

		if (selectedReport.joins.table) {
			for (let i = 0; i < selectedReport.joins.table.length; i++) {
				this.selectedParams.joinTable[i] =
					selectedReport.joins.table[i];
				this.selectedParams.joinSelect[i] =
					selectedReport.joins.select[i];
				this.selectedParams.joinTerm[i] = selectedReport.joins.term[i];
				this.selectedParams.joinValue[i] =
					selectedReport.joins.value[i];
				this.selectedParams.joinType[i] = selectedReport.joins.type[i];
				this.selectedParams.joinIsNested[i] =
					selectedReport.joins.isNested[i];
				$scope.UpdateColumns(this.selectedParams.joinTable[i], '');
			}
		}

		if (selectedReport.filters.select) {
			for (let j = 0; j < selectedReport.filters.select.length; j++) {
				this.selectedParams.filterSelect[j] =
					selectedReport.filters.select[j];
				this.selectedParams.filterTerm[j] =
					selectedReport.filters.term[j];
				this.selectedParams.filterValue[j] =
					selectedReport.filters.value[j];
				this.selectedParams.filterOperator[j] =
					selectedReport.filters.operator[j];
			}
			for (let l = 0; l < selectedReport.filters.token.length; l++) {
				this.selectedParams.filterToken[l] =
					selectedReport.filters.token[l];
			}
		}

		for (let p = 0; p < selectedReport.headers.value.length; p++) {
			this.selectedParams.headers[p] = selectedReport.headers.value[p];
		}

		this.selectedParams.shared = selectedReport.shared;
		this.selectedParams.report_id = selectedReport.id;
		this.selectedParams.order = selectedReport.order;
		this.selectedParams.direction = selectedReport.direction;
		this.selectedParams.name = selectedReport.name;
		this.selectedParams.frequency = selectedReport.frequency;
	};
	$scope.AssignReport(null);

	$scope.ClearReport = () => {
		this.reportData = {};
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
			url: baseURL + 'export',
			data: this.selectedParams,
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
		for (let i = 0; i < this.selectedParams.filterToken.length; i++) {
			if (this.selectedParams.filterToken[i] === '(') {
				depth++;
			}
			if (this.selectedParams.filterToken[i] === ')') {
				depth--;
			}
			if (this.selectedParams.filterToken[i] === 'ex') {
				if (index === exCount) {
					break;
				}
				exCount++;
			}
		}
		return depth - 1;
	};

	$scope.RemoveJoin = (index: number) => {
		this.selectedParams.joinSelect.splice(index, 1);
		this.selectedParams.joinTerm.splice(index, 1);
		this.selectedParams.joinValue.splice(index, 1);
		this.selectedParams.joinIsNested.splice(index, 1);
		this.selectedParams.joinType.splice(index, 1);
		const removedJoin = this.selectedParams.joinTable.splice(index, 1);
		$scope.UpdateColumns('', removedJoin[0]);
	};
	$scope.RemoveFilter = (index: number) => {
		let exCount = 0;
		for (let i = 0; i < this.selectedParams.filterToken.length; i++) {
			if (this.selectedParams.filterToken[i] === 'ex') {
				if (exCount === index) {
					let x = 1;
					while (
						this.selectedParams.filterToken[i - x] === '(' &&
						this.selectedParams.filterToken[i + x] === ')'
					) {
						this.selectedParams.filterToken[i - x] = ' ';
						this.selectedParams.filterToken[i + x] = ' ';
						x++;
					}
					this.selectedParams.filterToken[i] = ' ';
					break;
				}
				exCount++;
			}
		}
		for (let i = this.selectedParams.filterToken.length - 1; i >= 0; i--) {
			if (this.selectedParams.filterToken[i] === ' ') {
				this.selectedParams.filterToken.splice(i, 1);
			}
		}
		this.selectedParams.filterSelect.splice(index, 1);
		this.selectedParams.filterTerm.splice(index, 1);
		this.selectedParams.filterValue.splice(index, 1);
		this.selectedParams.filterOperator.splice(index, 1);
	};

	this.runReport = (page: number = 1) => {
		this.reportRan = false;
		this.reportLoading = true;
		this.selectedParams.perPage = this.perPage;
		this.selectedParams.page = page;

		const url = `${baseURL}run`;
		const data = this.selectedParams;

		$http
			.post(url, data)
			.then((response) => response.data)
			.then((responseData: { results?: { data?: unknown[] } }) => {
				this.reportData = responseData.results;
				if (
					responseData.results &&
					responseData.results.data &&
					responseData.results.data.length
				) {
					this.reportHeaders = Object.keys(
						responseData.results.data[0]
					);
				}
			})
			.catch((error) => console.error(error))
			.finally(() => {
				this.reportLoading = false;
				this.reportRan = true;
			});
	};

	$scope.SaveReport = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: baseURL,
			data: this.selectedParams,
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
				!this.selectedParams.tables.includes(oldValue) &&
				!this.selectedParams.joinTable.includes(oldValue)
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
			url: baseURL + selectedReport.id,
			data: this.selectedParams,
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
