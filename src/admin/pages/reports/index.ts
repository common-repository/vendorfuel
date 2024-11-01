import angular from 'angular';
import template from './index.template.html';
import type { Localized } from '../../types';
import { ReportTableService } from '../../features/reports/report-table-service';
declare const localized: Localized;

export const ReportsPage: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = ['$http'];

function controller($http: ng.IHttpService) {
	this.allColumns = [];
	this.allTables = ReportTableService.getAllTables();
	this.clear = true;
	this.comparators = ReportTableService.getComparators();
	this.filterOperators = ['OR', 'AND'];
	this.joinTypes = {
		standard: 'Standard',
		left: 'Left',
		right: 'Right',
	};
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
	this.reportData = {};
	this.reportHeaders = [];
	this.reportLoading = false;
	this.storeTables = ReportTableService.getStoreTables();

	this.$onInit = () => {
		this.index();
	};

	this.handlePageChange = (page: number) => {
		this.runReport(page);
	};

	this.handleRowsPerPageChange = () => {
		this.runReport();
	};

	this.index = () => {
		const url = `${localized.apiURL}/admin/reports/all`;

		this.isBusy = true;
		$http
			.get(url)
			.then((response) => response.data)
			.then(
				(responseData: {
					personal_reports: unknown[];
					shared_reports: unknown[];
				}) => {
					const {
						shared_reports: shared,
						personal_reports: personal,
					} = responseData;
					this.savedReports = [...shared, ...personal];
				}
			)
			.finally(() => {
				this.isBusy = false;
			});
	};

	this.addJoinRow = () => {
		const initJoin = this.allTables.admin_users[0];
		this.selectedParams.joinTable.push(initJoin.table);
		this.updateColumns(initJoin.table, '');
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
		this.selectedParams.filterTerm.push(this.comparators[0]);
		this.selectedParams.filterValue.push('');
		this.selectedParams.filterOperator.push('OR');
	};

	// Populate selectedParams object with selected saved report
	this.assignReport = (selectedReport: any) => {
		// Reset report parameters
		// Parameters to use in request with the API
		this.clear = false;
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
		this.allColumns = [];

		if (!selectedReport) {
			return;
		}

		this.selectedParams.tables.push(selectedReport.tables.value[0]);
		this.updateColumns(this.selectedParams.tables[0], '');

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
				this.updateColumns(this.selectedParams.joinTable[i], '');
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

	this.clearReport = () => {
		this.reportData = {};
		this.assignReport(null);
		this.clear = true;
	};

	this.destroyReport = (id: number) => {
		const url = `${localized.apiURL}/admin/reports/${id}`;
		$http.delete(url).then(() => {
			this.isBusy = false;
		});
	};

	this.downloadReport = () => {
		this.isBusy = true;
		const url = `${localized.apiURL}/admin/reports/export`;
		const data = this.selectedParams;

		$http.post(url, data).then(() => {
			this.isBusy = false;
		});
	};

	this.removeJoin = (index: number) => {
		this.selectedParams.joinSelect.splice(index, 1);
		this.selectedParams.joinTerm.splice(index, 1);
		this.selectedParams.joinValue.splice(index, 1);
		this.selectedParams.joinIsNested.splice(index, 1);
		this.selectedParams.joinType.splice(index, 1);
		const removedJoin = this.selectedParams.joinTable.splice(index, 1);
		this.updateColumns('', removedJoin[0]);
	};

	this.removeFilter = (index: number) => {
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

		const url = `${localized.apiURL}/admin/reports/run`;
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

	this.save = () => {
		this.isBusy = true;
		const url = `${localized.apiURL}/admin/reports`;
		const data = this.selectedParams;

		$http.post(url, data).then(() => {
			this.isBusy = false;
		});
	};

	this.updateColumns = (newValue: string, oldValue: string) => {
		// If removing columns
		if (oldValue !== '') {
			// Check if table we're switching from is not selected on another table/join, else skip
			if (
				!this.selectedParams.tables.includes(oldValue) &&
				!this.selectedParams.joinTable.includes(oldValue)
			) {
				let i = this.allColumns.length;
				let found = false;
				while (i-- && !found) {
					// Find table we're switching from and remove from list
					if (this.allColumns[i].table === oldValue) {
						for (
							let j = 0;
							j < this.allTables[oldValue].length;
							j++
						) {
							this.allColumns.splice(i--, 1);
						}
						found = true;
					}
				}
			}
		}
		// If adding columns
		if (newValue !== '') {
			let tableExists = false,
				k = this.allColumns.length - 1;
			while (!tableExists && k >= 0) {
				// Check if new table/join is already in list
				if (this.allColumns[k].table === newValue) {
					tableExists = true;
				}
				k--;
			}
			if (!tableExists) {
				// If table not in list, add
				angular.forEach(this.allTables[newValue], (value) => {
					this.allColumns.push(value);
				});
			}
		}
	};

	this.update = (selectedReport: any) => {
		this.isBusy = true;
		const url = `${localized.apiURL}/admin/reports/${selectedReport.id}`;
		const data = this.selectedParams;

		$http.put(url, data).then(() => {
			this.isBusy = false;
		});
	};
}
