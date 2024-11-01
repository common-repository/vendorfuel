( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.controller( 'ReportsController', ReportsController );

	ReportsController.$inject = [
		'$scope',
		'$rootScope',
		'$cookies',
		'$timeout',
		'Admin',
		'Reports',
		'Debug',
		'Settings',
		'Localized',
		'Utils',
		'$stateParams',
	];

	/**
	 * @param {Object} $scope       Angular service
	 * @param {Object} $rootScope   Angular service
	 * @param {Object} $cookies     Angular service
	 * @param {Object} $timeout     Angular service
	 * @param {Object} Admin        VendorFuel service
	 * @param {Object} Reports      VendorFuel service
	 * @param {Object} Debug        VendorFuel service
	 * @param {Object} Settings     VendorFuel service
	 * @param {Object} Localized    VendorFuel service
	 * @param {Object} Utils        VendorFuel service
	 * @param {Object} $stateParams UI Router service
	 */
	function ReportsController(
		$scope: any,
		$rootScope: any,
		$cookies: ng.cookies.ICookiesService,
		$timeout: ng.ITimeoutService,
		Admin: any,
		Reports: any,
		Debug: any,
		Settings: any,
		Localized: any,
		Utils: any,
		$stateParams: ng.ui.IStateParamsService,
	) {
		/**
		 * Initialization
		 */
		this.init = () => {
			this.breadcrumbs = [
				{ name: 'Reports', state: 'reports' },
			];

			$scope.activeTab = parseInt( $stateParams.activeTab ) || 0;
			$scope.allColumns = []; // Columns of all selected tables
			$scope.allTables = Reports.getAllTables();
			$scope.clear = true;
			$scope.comparators = Reports.getComparators();
			$scope.downloads = []; // List of downloaded reports
			$scope.filterOperators = [ 'OR', 'AND' ];
			$scope.frequencies = {
				daily: 'Daily',
				weekly: 'Weekly',
				monthly: 'Monthly',
				quarterly: 'Quarterly',
				clear: 'Clear Schedule',
			};
			$scope.isAuthed = Admin.Authed();
			$scope.joinTypes = { standard: 'Standard', left: 'Left', right: 'Right' };
			$scope.loading = false;
			$scope.reportLoading = false;
			$scope.reportsEndpoint = localized.apiURL + '/admin/reports/';
			$scope.reportData = {};
			$scope.reportHeaders = [];
			$scope.rppValues = [ 15, 30, 50, 100 ];
			$scope.per_page = $scope.rppValues[ 0 ]; // Must be after rrpValues is defined.

			$scope.savedReports = []; // List of person/shared reports that were saved
			$scope.scheduleSaveError = false;
			$scope.scheduleSaveSuccessful = false;
			$scope.storeTables = Reports.getStoreTables();
		};
		this.init();

		$scope.TabChanged = function( i: number ) {
			$scope.activeTab = i;
			$scope.loading = true;
			Settings.errors = {};
			const req = {
				method: 'GET',
				url: $scope.reportsEndpoint,
			};
			switch ( i ) {
				case 0:
					// Initialize reports page
					// Request saved reports from API, populate saved reports list
					req.url += 'all';
					Utils.getHttpPromise( req ).then( function( resp: any ) {
						$scope.savedReports = [];
						angular.forEach( resp.personal_reports, function( value ) {
							$scope.savedReports.push( value );
						} );
						angular.forEach( resp.shared_reports, function( value ) {
							$scope.savedReports.push( value );
						} );
						$scope.AssignReport( null );
					}, function( errResp: Error ) {
						Debug.error( errResp );
					} ).finally( function() {
						$scope.loading = false;
					} );
					break;
				case 1:
					req.url += 'download';
					Utils.getHttpPromise( req ).then( function( resp: any ) {
						$scope.downloads = resp.reports;
					}, function( errResp: Error ) {
						Debug.error( errResp );
					} ).finally( function() {
						$scope.loading = false;
					} );
					break;
				case 2:
					req.url += 'all';
					$scope.scheduleReports = {};
					$scope.scheduleReports.id = [];
					$scope.scheduleReports.frequency = [];
					Utils.getHttpPromise( req ).then( function( resp: any ) {
						$scope.savedReports = [];
						angular.forEach( resp.personal_reports, function( value ) {
							$scope.savedReports.push( value );
						} );
						angular.forEach( resp.shared_reports, function( value ) {
							$scope.savedReports.push( value );
						} );
						$scope.AssignReport( null );
						angular.forEach( $scope.savedReports, function( value ) {
							$scope.scheduleReports.id.push( value.id );
							$scope.scheduleReports.frequency.push( value.frequency );
						} );
						$scope.UpdateScheduleModel( 0 );
					}, function( errResp: Error ) {
						Debug.error( errResp );
					} ).finally( function() {
						$scope.loading = false;
					} );

					break;
			}
		};
		$scope.AddJoinRow = function() {
			const initJoin = $scope.allTables.admin_groups[ 0 ];
			$scope.selectedParams.joinTable.push( initJoin.table );
			$scope.UpdateColumns( initJoin.table, '' );
			$scope.selectedParams.joinSelect.push( initJoin.value );
			$scope.selectedParams.joinTerm.push( '=' );
			$scope.selectedParams.joinValue.push( '' );
			$scope.selectedParams.joinIsNested.push( false );
			$scope.selectedParams.joinType.push( 'standard' );
		};

		$scope.AddFilterRow = function() {
			if ( $scope.selectedParams.filterSelect.push( '' ) === 1 ) {
				$scope.selectedParams.filterToken.push( '(', 'ex', ')' );
			} else {
				$scope.selectedParams.filterToken.splice( $scope.selectedParams.filterToken.length - 1, 0, 'ex' );
			}
			$scope.selectedParams.filterTerm.push( $scope.comparators[ 0 ] );
			$scope.selectedParams.filterValue.push( '' );
			$scope.selectedParams.filterOperator.push( 'OR' );
		};

		$scope.AddGroupFilter = function( index: number, type: string ) {
			const tokenGroup: any = [ '(', 'ex', ')' ];
			let exCount = 0;
			for ( let i = 0; i < $scope.selectedParams.filterToken.length; i++ ) {
				if ( $scope.selectedParams.filterToken[ i ] === 'ex' ) {
					if ( index === exCount ) {
						if ( type === 'group' ) {
							$scope.selectedParams.filterToken.splice.apply( $scope.selectedParams.filterToken, [ i + 1, 0 ].concat( tokenGroup ) );
						} else {
							$scope.selectedParams.filterToken.splice( i + 1, 0, 'ex' );
						}
						break;
					}
					exCount++;
				}
			}
			$scope.selectedParams.filterSelect.splice( index + 1, 0, '' );
			$scope.selectedParams.filterTerm.splice( index + 1, 0, $scope.comparators[ 0 ] );
			$scope.selectedParams.filterValue.splice( index + 1, 0, '' );
			$scope.selectedParams.filterOperator.splice( index + 1, 0, 'OR' );
		};
		// Populate selectedParams object with selected saved report
		$scope.AssignReport = function( selectedReport: any ) {
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

			if ( ! selectedReport ) {
				return;
			}

			$scope.selectedParams.tables.push( selectedReport.tables.value[ 0 ] );
			$scope.UpdateColumns( $scope.selectedParams.tables[ 0 ], '' );

			if ( selectedReport.joins.table ) {
				for ( let i = 0; i < selectedReport.joins.table.length; i++ ) {
					$scope.selectedParams.joinTable[ i ] = selectedReport.joins.table[ i ];
					$scope.selectedParams.joinSelect[ i ] = selectedReport.joins.select[ i ];
					$scope.selectedParams.joinTerm[ i ] = selectedReport.joins.term[ i ];
					$scope.selectedParams.joinValue[ i ] = selectedReport.joins.value[ i ];
					$scope.selectedParams.joinType[ i ] = selectedReport.joins.type[ i ];
					$scope.selectedParams.joinIsNested[ i ] = selectedReport.joins.isNested[ i ];
					$scope.UpdateColumns( $scope.selectedParams.joinTable[ i ], '' );
				}
			}

			if ( selectedReport.filters.select ) {
				for ( let j = 0; j < selectedReport.filters.select.length; j++ ) {
					$scope.selectedParams.filterSelect[ j ] = selectedReport.filters.select[ j ];
					$scope.selectedParams.filterTerm[ j ] = selectedReport.filters.term[ j ];
					$scope.selectedParams.filterValue[ j ] = selectedReport.filters.value[ j ];
					$scope.selectedParams.filterOperator[ j ] = selectedReport.filters.operator[ j ];
				}
				for ( let l = 0; l < selectedReport.filters.token.length; l++ ) {
					$scope.selectedParams.filterToken[ l ] = selectedReport.filters.token[ l ];
				}
			}

			for ( let p = 0; p < selectedReport.headers.value.length; p++ ) {
				$scope.selectedParams.headers[ p ] = selectedReport.headers.value[ p ];
			}

			$scope.selectedParams.shared = selectedReport.shared;
			$scope.selectedParams.report_id = selectedReport.id;
			$scope.selectedParams.order = selectedReport.order;
			$scope.selectedParams.direction = selectedReport.direction;
			$scope.selectedParams.name = selectedReport.name;
			$scope.selectedParams.frequency = selectedReport.frequency;
		};
		$scope.AssignReport( null );

		$scope.ClearReport = function() {
			$scope.reportData = {};
			$scope.AssignReport( null );
			$scope.clear = true;
		};
		$scope.DeleteReport = function( selectedReport: any ) {
			const callback = {
				confirm() {
					$scope.loading = true;
					const req = {
						method: 'DELETE',
						url: $scope.reportsEndpoint + selectedReport.id,
					};
					Utils.getHttpPromise( req ).then( function() {
						$scope.TabChanged( 0 );
					}, function( errResp: Error ) {
						Debug.error( errResp );
					} ).finally( function() {
						$scope.loading = false;
					} );
				},
				cancel() { },
			};
			$scope.confirm.Show( callback, 'Delete Report?', 'This action cannot be undone.', 'Back', 'DELETE' );
		};
		$scope.Download = function( downloadId: number ) {
			const tokenA = $cookies.get( 'vendorfuel-admin-tokena' );
			const tokenB = $cookies.get( 'vendorfuel-admin-tokenb' );
			const req = $scope.reportsEndpoint + 'download/' + downloadId + '?apikey=' + Localized.api_key +
				'&tokena=' + tokenA + '&tokenb=' + tokenB;
			window.open( req, '_blank' );
		};
		$scope.DownloadReport = function() {
			$scope.loading = true;
			const req = {
				method: 'POST',
				url: $scope.reportsEndpoint + 'export',
				data: $scope.selectedParams,
			};
			Utils.getHttpPromise( req ).then( function() {

			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		};
		$scope.GroupNumber = function( index: number ) {
			let exCount = 0;
			let depth = 0;
			for ( let i = 0; i < $scope.selectedParams.filterToken.length; i++ ) {
				if ( $scope.selectedParams.filterToken[ i ] === '(' ) {
					depth++;
				}
				if ( $scope.selectedParams.filterToken[ i ] === ')' ) {
					depth--;
				}
				if ( $scope.selectedParams.filterToken[ i ] === 'ex' ) {
					if ( index === exCount ) {
						break;
					}
					exCount++;
				}
			}
			return depth - 1;
		};

		$scope.RemoveJoin = function( index: number ) {
			$scope.selectedParams.joinSelect.splice( index, 1 );
			$scope.selectedParams.joinTerm.splice( index, 1 );
			$scope.selectedParams.joinValue.splice( index, 1 );
			$scope.selectedParams.joinIsNested.splice( index, 1 );
			$scope.selectedParams.joinType.splice( index, 1 );
			const removedJoin = $scope.selectedParams.joinTable.splice( index, 1 );
			$scope.UpdateColumns( '', removedJoin[ 0 ] );
		};
		$scope.RemoveFilter = function( index: number ) {
			let exCount = 0;
			for ( let i = 0; i < $scope.selectedParams.filterToken.length; i++ ) {
				if ( $scope.selectedParams.filterToken[ i ] === 'ex' ) {
					if ( exCount === index ) {
						let x = 1;
						while ( $scope.selectedParams.filterToken[ i - x ] === '(' &&
							$scope.selectedParams.filterToken[ i + x ] === ')' ) {
							$scope.selectedParams.filterToken[ i - x ] = ' ';
							$scope.selectedParams.filterToken[ i + x ] = ' ';
							x++;
						}
						$scope.selectedParams.filterToken[ i ] = ' ';
						break;
					}
					exCount++;
				}
			}
			for ( let i = $scope.selectedParams.filterToken.length - 1; i >= 0; i-- ) {
				if ( $scope.selectedParams.filterToken[ i ] === ' ' ) {
					$scope.selectedParams.filterToken.splice( i, 1 );
				}
			}
			$scope.selectedParams.filterSelect.splice( index, 1 );
			$scope.selectedParams.filterTerm.splice( index, 1 );
			$scope.selectedParams.filterValue.splice( index, 1 );
			$scope.selectedParams.filterOperator.splice( index, 1 );
		};
		$scope.RunReport = function( rpp: number, page: number ) {
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
			Utils.getHttpPromise( req ).then( function( resp: any ) {
				$scope.reportData = resp.results;
				if ( resp.results && resp.results.data && resp.results.data.length ) {
					$scope.reportHeaders = Object.keys( resp.results.data[ 0 ] );
				}
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				// $scope.loading = false;
				$scope.reportLoading = false;
				$scope.reportRan = true;
			} );
		};
		$scope.SaveReport = function() {
			$scope.loading = true;
			const req = {
				method: 'POST',
				url: $scope.reportsEndpoint,
				data: $scope.selectedParams,
			};
			Utils.getHttpPromise( req ).then( function() {

			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		};
		$scope.Test = function() {
			Debug.log( $scope.scheduleReports );
			Debug.log( $scope.selectedParams );
		};
		// Update table columns
		$scope.UpdateColumns = function( newValue: string, oldValue: string ) {
			// If removing columns
			if ( oldValue !== '' ) {
				// Check if table we're switching from is not selected on another table/join, else skip
				if ( ! $scope.selectedParams.tables.includes( oldValue ) && ! $scope.selectedParams.joinTable.includes( oldValue ) ) {
					let i = $scope.allColumns.length;
					let found = false;
					while ( i-- && ! found ) { // Find table we're switching from and remove from list
						if ( $scope.allColumns[ i ].table === oldValue ) {
							for ( let j = 0; j < $scope.allTables[ oldValue ].length; j++ ) {
								$scope.allColumns.splice( i--, 1 );
							}
							found = true;
						}
					}
				}
			}
			// If adding columns
			if ( newValue !== '' ) {
				let tableExists = false,
					k = $scope.allColumns.length - 1;
				while ( ! tableExists && k >= 0 ) { // Check if new table/join is already in list
					if ( $scope.allColumns[ k ].table === newValue ) {
						tableExists = true;
					}
					k--;
				}
				if ( ! tableExists ) { // If table not in list, add
					angular.forEach( $scope.allTables[ newValue ], function( value ) {
						$scope.allColumns.push( value );
					} );
				}
			}
		};
		$scope.UpdateReport = function( selectedReport: any ) {
			$scope.loading = true;
			const req = {
				method: 'PUT',
				url: $scope.reportsEndpoint + selectedReport.id,
				data: $scope.selectedParams,
			};
			Utils.getHttpPromise( req ).then( function() {

			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		};
		$scope.UpdateScheduleModel = function( index: number ) {
			$scope.selectedId = $scope.savedReports[ index ].id;
			$scope.scheduleReports.selectedIndex = index;
		};
		$scope.UpdateSchedules = function() {
			$scope.loading = true;
			angular.forEach( $scope.scheduleReports.frequency, function( value, key ) {
				if ( value === 'Clear Schedule' ) {
					$scope.scheduleReports.frequency[ key ] = 'null';
				}
			} );
			const req = {
				method: 'POST',
				url: $scope.reportsEndpoint + 'schedule',
				data: $scope.scheduleReports,
			};
			Utils.getHttpPromise( req ).then( function( resp: any ) {
				if ( ! resp.errors.length ) {
					$scope.scheduleSaveSuccessful = true;
					$timeout( function() {
						$scope.scheduleSaveSuccessful = false;
					}, 5000 );
				} else {
					$scope.scheduleSaveError = true;
					$timeout( function() {
						$scope.scheduleSaveError = false;
					}, 5000 );
				}
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		};
	}
}() );

