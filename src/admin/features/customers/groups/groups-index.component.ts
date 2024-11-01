import Papa from 'papaparse';
import template from './groups-index.component.html';
declare const angular: ng.IAngularStatic;

export const GroupsIndex: ng.IComponentOptions = {
	template,
	controller: GroupsController,
};

GroupsController.$inject = [
	'$scope',
	'$state',
	'$stateParams',
	'Admin',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
	'SearchModal',
	'$window',
	'$timeout',
];

/**
 * @param {Object} $scope       service
 * @param {Object} $state       service
 * @param {Object} $stateParams service
 * @param {Object} Admin        service
 * @param {Object} Settings     service
 * @param {Object} Debug        service
 * @param {Object} Utils        service
 * @param {Object} Localized    service
 * @param {Object} SearchModal  service
 * @param {Object} $window      service
 * @param {Object} $timeout     service
 */
function GroupsController(
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Settings: any,
	Debug: any,
	Utils: any,
	Localized: any,
	SearchModal: any,
	$window: ng.IWindowService,
	$timeout: ng.ITimeoutService,
) {
	const vm = this;
	vm.deleteGroup = deleteGroup;

	/**
	 * Initialization
	 */
	this.init = () => {
		this.breadcrumbs = [
			{ name: 'Customers', state: 'customers.page' },
			{ name: 'Groups', state: 'customers.groups.index' },
		];

		$scope.batchEndpoint = localized.apiURL + '/admin/group/batch/';
		$scope.batchListOptions = {
			any: 'All',
			pending: 'Pending',
			confirmed: 'Confirmed',
			processing: 'Processing',
			processed: 'Processed',
		};
		$scope.isAuthed = Admin.Authed();
		$scope.loading = false;
		$scope.loadingMore = false;
		$scope.newGroup = {
			customers: {
				data: [],
			},
			group_registration_available: 0,
			shipping_mode: 'default',
		};
		$scope.regValues = [
			{ key: 1, value: 'Active' },
			{ key: 0, value: 'Inactive' },
		];
		$scope.rppValues = [ 15, 30, 50, 100 ];
		$scope.searchTerm = '';
		$scope.shippingModes = {
			default: 'Default',
			free: 'Free',
			method: 'Flat Rate',
			parcel: 'Parcel',
		};
		$scope.sortBatchParams = {
			sort_by: 'batch_id',
			sort_type: '',
			status: 'any',
		};
		$scope.updatedRates = [];
		$scope.uploading = false;

		vm.activeTab = parseInt( $stateParams.activeTab ) || 0;
		vm.groupEndpoint = localized.apiURL + '/admin/groups/';
		vm.searchOptions = {
			group_id: 'ID',
			name: 'Name',
			parent_group_id: 'Parent ID',
			default_price_sheet: 'Default Price Sheet',
		};
		vm.searchParams = {
			page: 1,
			q: '',
			searchBy: '',
			sortBy: '',
			sortType: '',
			rpp: $scope.rppValues[ 0 ], // Must be defined after rppValues is declared.
		};
		vm.sortAscending = true;
	};
	this.init();

	//FUNCTIONS
	$scope.LoginCallback = function() {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};
	$scope.GroupSearchResults = function( resp: any ) { //callback that is used by the search modal
		if ( vm.activeTab === 2 ) {
			vm.selectedGroup.parent_group = resp[ 0 ].value;
			vm.selectedGroup.parent_group_id = resp[ 0 ].value.group_id;
		} else if ( vm.activeTab === 1 ) {
			$scope.newGroup.parent_group = resp[ 0 ].value;
			$scope.newGroup.parent_group_id = resp[ 0 ].value.group_id;
		}
	};
	$scope.CustomerSearchResults = function( resp: any ) {
		if ( vm.activeTab === 2 ) {
			const currentIds = vm.selectedGroup.customers.data.map( function( c: any ) {
				return c.customer_id;
			} );
			for ( let i = 0; i < resp.length; i++ ) {
				if ( currentIds.includes( resp[ i ].value.customer_id ) && resp[ i ].action === 'remove' ) {
					for ( let j = 0; j < vm.selectedGroup.customers.data.length; j++ ) {
						if ( vm.selectedGroup.customers.data[ j ].customer_id === resp[ i ].value.customer_id ) {
							vm.selectedGroup.customers.data.splice( j, 1 );
							break;
						}
					}
				}
				if ( ! currentIds.includes( resp[ i ].value.customer_id ) ) {
					vm.selectedGroup.customers.data.push( resp[ i ].value );
				}
			}
		} else if ( vm.activeTab === 1 ) {
			if ( $scope.newGroup.customers.data && $scope.newGroup.customers.data.length ) {
				const customerIds = $scope.newGroup.customers.data.map( function( c: any ) {
					return c.customer_id;
				} );
				for ( let k = 0; k < resp.length; k++ ) {
					if ( ! customerIds.includes( resp[ k ].value.customer_id ) ) {
						$scope.newGroup.customers.data.push( resp[ k ].value );
					}
				}
			} else {
				for ( let l = 0; l < resp.length; l++ ) {
					$scope.newGroup.customers.data.push( resp[ l ].value );
				}
			}
		}
	};
	$scope.SearchCancelled = function() { //callback that is used by the search modal

	};

	$scope.Show = function( page: number ) {
		const params = {
			page,
		};
		Settings.errors = {};
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		const req = {
			method: 'GET',
			url: vm.groupEndpoint,
			params,
		};
		req.url += vm.selectedGroup.group_id;
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			vm.selectedGroup = resp.group;
			vm.selectedGroup.shipping_flat_rates = [];
			$scope.priceSheets = resp.price_sheets;
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	$scope.TabChanged = function( i: number ) {
		vm.activeTab = i;
		Settings.errors = {};
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		let req: any = {
			method: 'GET',
			url: vm.groupEndpoint,
		};
		switch ( i ) {
			case 0:
				Utils.getHttpPromise( req ).then( function( resp: any ) {
					$scope.customerGroups = resp.groups;
					$scope.priceSheets = resp.price_sheets;
					$scope.newGroup.default_price_sheet = resp.default_price_sheet;
				}, function( errResp: Error ) {
					Debug.error( errResp );
				} ).finally( function() {
					$scope.loading = false;
				} );
				break;
			case 1:
				//Second tab selected
				if ( ! $scope.newGroup.default_price_sheet ) {
					Utils.getHttpPromise( req ).then( function( resp: any ) {
						$scope.priceSheets = resp.price_sheets;
						$scope.newGroup.default_price_sheet = resp.default_price_sheet;
					}, function( errResp: Error ) {
						Debug.error( errResp );
					} ).finally( function() {
						$scope.loading = false;
					} );
				} else {
					$scope.loading = false;
				}
				break;
			case 2:
				$scope.Show( 1 );
				break;
			case 3:
				$scope.loading = false;
				break;
			case 4:
				req = {
					method: 'GET',
					url: $scope.batchEndpoint,
					params: $scope.sortBatchParams,
				};
				Utils.getHttpPromise( req ).then( function( resp: any ) {
					$scope.batches = resp.search_results;
					// eslint-disable-next-line no-shadow
					for ( let i = 0; i < $scope.batches.length; i++ ) {
						if ( $scope.batches[ i ].status === 'processing' ) {
							$scope.UpdateBatchProgress();
							break;
						}
					}
				}, function( errResp: Error ) {
					Debug.error( errResp );
				} ).finally( function() {
					$scope.loading = false;
				} );
				break;
			case 5:
				req = {
					method: 'GET',
					url: $scope.batchEndpoint + $scope.selectedBatch.batch_id,
				};
				Utils.getHttpPromise( req ).then( function( resp: any ) {
					$scope.selectedBatch = resp.batches[ 0 ];
					$scope.batchHeaders = resp.batches[ 0 ].columns;
				}, function( errResp: Error ) {
					Debug.error( errResp );
				} ).finally( function() {
					$scope.loading = false;
				} );
				break;
		}
	};

	$scope.SelectChild = function( groupId: number ) {
		$scope.loading = true;
		const req = {
			method: 'GET',
			url: vm.groupEndpoint,
		};
		req.url += groupId;
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			vm.selectedGroup = resp.group;
			$scope.priceSheets = resp.price_sheets;
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};
	$scope.ChangeTab = function( tabIndex: number, customerIndex: number ) {
		vm.activeTab = tabIndex;
		vm.selectedGroup = $scope.customerGroups.data[ customerIndex ];
	};

	this.changeSortBy = ( sortBy: string, e: Event ) => {
		e.preventDefault();
		vm.sortAscending = ( vm.searchParams.sortBy === sortBy ) ? ! vm.sortAscending : true;
		vm.searchParams.sortBy = sortBy;
		vm.searchParams.sortType = vm.sortAscending ? 'asc' : 'desc';
		this.searchGroups();
	};

	this.searchGroups = function() {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: vm.groupEndpoint,
			params: vm.searchParams,
		};
		Utils.getHttpPromise( req )
			.then( function( resp: any ) {
				$scope.customerGroups = resp.groups;
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loadingMore = false;
			} );
	};

	this.setPage = ( page: number ) => {
		this.searchParams.page = page;
		this.searchGroups();
	};

	this.setRpp = ( rpp: number ) => {
		this.searchParams.rpp = rpp;
		this.searchGroups();
	};

	this.setQuery = ( query: string, searchBy: string ) => {
		this.searchParams.page = 1; // Reset page when query changes.
		this.searchParams.q = query;
		this.searchParams.searchBy = searchBy;
		this.searchTerm = this.searchParams.q;
		this.searchedBy = this.searchParams.searchBy;
		this.searchGroups();
	};

	$scope.OpenCustomerSearchModal = function() {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/customers/',
						params: {
							q: '',
						},
					},
					relationships: [ 'customers', 'group' ],
					fields: [ 'customer_id', 'name', 'email', '.name' ],
					fieldPrefixes: [ 'ID: ', '', '', 'Group: ' ],
					id: 'customer_id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url: vm.groupEndpoint + vm.selectedGroup.group_id,
						params: {
							q: '',
						},
					},
					relationships: [ 'group', 'customers' ],
					fields: [ 'customer_id', 'name', 'email', 'status' ],
					fieldPrefixes: [ 'ID: ', '', '', 'Status: ' ],
					id: 'customer_id',
				},
			],
		};
		callback = {
			confirm: $scope.CustomerSearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, 'Select Customers', data, 'Add items' );
	};
	$scope.OpenGroupSearchModal = function() {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: vm.groupEndpoint,
						params: {
							q: '',
						},
					},
					relationships: [ 'groups' ],
					fields: [ 'group_id', 'parent_group_id', 'name', 'default_price_sheet' ],
					fieldPrefixes: [ 'ID: ', 'Parent ID: ', '', 'Price Sheet: ' ],
					id: 'group_id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: $scope.GroupSearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, $scope.newGroup.name || 'New Group', data, 'Add items' );
	};
	$scope.OpenRatesSearchModal = function() {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/shipping/flat-rate/',
						params: {
							q: '',
							excludedField: 'group_id',
							excludedId: vm.selectedGroup.group_id,
							excludedTable: 'shipping_flat_rate_group',
						},
					},
					relationships: [ 'shipping_flat_rates' ],
					fields: [ 'id', 'name', 'cost', 'enabled' ],
					fieldPrefixes: [ '', 'Name: ', 'Cost: ', 'Enabled: ' ],
					id: 'id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url: vm.groupEndpoint + vm.selectedGroup.group_id,
					},
					relationships: [ 'group' ],
					fields: [ 'name', 'cost', 'enabled' ],
					fieldPrefixes: [ 'Name: ', 'Cost: ', 'Enabled: ' ],
					id: 'id',
					selectOne: false,
				},
			],
			updatedItems: $scope.updatedRates,
		};
		callback = {
			confirm: $scope.rateResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, 'Flat Rates', data, 'Add Shipping Rates' );
	};
	$scope.rateResults = function( resp: any ) {
		if ( vm.activeTab === 2 ) {
			$scope.updatedRates = [];
			resp.forEach( function( rate: any ) {
				if ( rate.action === 'add' ) {
					$scope.updatedRates.push( rate );
					vm.selectedGroup.shipping_flat_rates.push( { id: rate.value.id } );
				}
				if ( rate.action === 'unselect' ) {
					angular.forEach( vm.selectedGroup.shipping_flat_rates, function( val, key ) {
						if ( val.id === rate.value.id ) {
							vm.selectedGroup.shipping_flat_rates.splice( key, 1 );
						}
					} );
				}
				if ( rate.action === 'remove' ) {
					$scope.updatedRates.push( rate );
					vm.selectedGroup.shipping_flat_rates.push( { id: rate.value.id, deleted: 1 } );
				}
				if ( rate.action === 'deselect' ) {
					angular.forEach( vm.selectedGroup.shipping_flat_rates, function( val, key ) {
						if ( val.id === rate.value.id ) {
							vm.selectedGroup.shipping_flat_rates.splice( key, 1 );
						}
					} );
				}
			} );
		}
	};
	$scope.rateCheck = function( rate: any ) {
		let check = false;
		angular.forEach( $scope.updatedRates, function( key ) {
			if ( key.value.id === rate.id && key.action === 'remove' ) {
				check = true;
			}
		} );
		return check;
	};
	$scope.UpdateGroup = function() {
		$scope.loading = true;
		const req = {
			method: 'PUT',
			url: vm.groupEndpoint + vm.selectedGroup.group_id,
			data: vm.selectedGroup,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			if ( resp.errors.length <= 0 ) {
				angular.forEach( $scope.updatedRates, function( rate ) {
					if ( rate.action === 'add' ) {
						vm.selectedGroup.flatrates.push( rate.value );
					} else {
						angular.forEach( vm.selectedGroup.flatrates, function( val, key ) {
							if ( val.id === rate.value.id ) {
								vm.selectedGroup.flatrates.splice( key, 1 );
							}
						} );
					}
				} );
				$scope.updatedRates = [];
			}
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};
	$scope.AddGroup = function() {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: vm.groupEndpoint,
			data: $scope.newGroup,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			if ( resp.errors.length <= 0 ) {
				$scope.newGroup = {};
				vm.selectedGroup = {
					group_id: resp.group_id,
				};
				vm.activeTab = 2;
			}
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	/**
	 * Delete a group
	 */
	function deleteGroup() {
		vm.isDeleting = true;
		const endpoint = vm.groupEndpoint + vm.selectedGroup.group_id;

		Utils.httpDelete( endpoint )
			.then( () => {
				vm.selectedGroup = null;
				vm.activeTab = 0;
			} )
			.catch( ( error: Error ) => {
				Debug.error( error );
			} )
			.finally( function() {
				vm.isDeleting = false;
			} );
	}

	$scope.UpdateBatchProgress = function() {
		const req = {
			method: 'GET',
			url: $scope.batchEndpoint,
			params: $scope.sortBatchParams,
		};
		let again = false;
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.batches = resp.search_results;
			for ( let i = 0; i < $scope.batches.length; i++ ) {
				if ( $scope.batches[ i ].status === 'processing' && vm.activeTab === 4 ) {
					again = true;
					break;
				}
			}
			if ( again ) {
				$timeout( function() {
					$scope.UpdateBatchProgress();
				}, 5000 );
			}
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			angular.noop();
		} );
	};
	$scope.SetUploading = function() {
		// eslint-disable-next-line no-shadow
		$scope.$apply( function( $scope: any ) {
			$scope.uploading = ! $scope.uploading;
		} );
	};
	$scope.SetFile = function( element: HTMLFormElement ) {
		// eslint-disable-next-line no-shadow
		$scope.$apply( function( $scope: any ) {
			$scope.theFile = element.files[ 0 ];
		} );
		const totalBytes = $scope.theFile.size;
		if ( totalBytes < 1000000 ) {
			$scope.fileSize = Math.floor( totalBytes / 1000 ) + 'KB';
		} else {
			$scope.fileSize = Math.floor( totalBytes / 1000000 ) + 'MB';
		}
		const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
		if ( regex.test( $scope.theFile.name.toLowerCase() ) ) {
			if ( typeof ( FileReader ) !== 'undefined' ) {
				const reader: any = new FileReader();
				reader.onload = function() {
					// eslint-disable-next-line no-undef
					Papa.parse( reader.result, {
						complete( results ) {
							const groups: any = [];
							for ( let i = 0; i <= results.data.length; i++ ) {
								const info = results.data[ i ];
								const group: any = [];
								angular.forEach( info, ( val, key ) => {
									group[ key ] = val;
								} );
								groups.push( group );
							}
							$scope.$apply( function() {
								$scope.groupSheetUpload = groups;
								$scope.IsVisible = true;
							} );
						},
					} );
					$scope.SetUploading();
				};

				reader.readAsText( $scope.theFile );
			} else {
				$window.alert( 'This browser does not support HTML5.' );
			}
		} else {
			$scope.groupSheetUpload = null;
			$scope.theFile = null;
			$scope.SetUploading();
			$window.alert( 'Please upload a valid CSV file.' );
		}
	};
	$scope.SortBatchIndex = function( sortBy: string ) {
		vm.sortAscending = ( $scope.sortBatchParams.sort_by === sortBy ) ? ! vm.sortAscending : true;
		$scope.sortBatchParams.sort_by = sortBy;
		$scope.sortBatchParams.sort_type = vm.sortAscending ? 'asc' : 'desc';
		$scope.SortBatches();
	};
	$scope.SortBatches = function() {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: $scope.batchEndpoint,
			params: $scope.sortBatchParams,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.batches = resp.search_results;
			for ( let i = 0; i < $scope.batches.length; i++ ) {
				if ( $scope.batches[ i ].status === 'processing' ) {
					$scope.UpdateBatchProgress();
					break;
				}
			}
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loadingMore = false;
		} );
	};
	$scope.ChangeBatchTab = function( tabIndex: number, batchIndex: number ) {
		vm.activeTab = tabIndex;
		$scope.selectedBatch = $scope.batches[ batchIndex ];
	};

	$scope.postUpload = function( index: number, id: number ) {
		$scope.selectedBatch = {
			batch_id: id,
		};
		vm.activeTab = index;
	};

	$scope.RemoveUploadFile = function() {
		$scope.groupSheetUpload = null;
		Localized.setNotification( {
			type: 'danger',
			message: 'File Successfully Removed',
		} );
	};

	$scope.UploadGroup = function() {
		$scope.loading = true;
		const fd = new FormData();
		fd.append( 'file', $scope.theFile );
		const req = {
			method: 'POST',
			url: $scope.batchEndpoint + 'upload',
			data: fd,
			transformRequest: angular.identity,
			headers: {
				// eslint-disable-next-line no-undefined
				'Content-Type': undefined as undefined,
			},
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.postUpload( 5, resp.batch_id );
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loading = false;
			Localized.setNotification( {
				type: 'success',
				message: 'File Successfully Uploaded',
			} );
		} );
	};
	$scope.ConfirmBatch = function() {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.batchEndpoint + 'confirm',
			data: {
				batch_id: $scope.selectedBatch.batch_id,
			},
		};
		Utils.getHttpPromise( req ).then( function() {
			$scope.selectedBatch = null;
			vm.activeTab = 4;
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	/**
	 * Punchout Profiles
	 */
	$scope.OpenSupplierSearch = function() {
		$scope.searchModalPage = 'supplier';
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/punchout/supplier',
						params: {
							q: '',
						},
					},
					relationships: [ 'suppliers' ],
					fields: [ 'id', 'name' ],
					fieldPrefixes: [ 'ID: ', '' ],
					id: 'id',
					selectOne: false,
				},
			],
		};
		callback = {
			confirm( resp: any ) {
				$scope.selectedGroup.punchout_profiles.push( {
					supplier: {
						name: resp[ 0 ].value.name,
						id: resp[ 0 ].value.id,
					},
				} );
			},
			cancel: () => {
				angular.noop();
			},
		};
		SearchModal.Show( callback, 'Suppliers', data, 'Add Supplier' );
	};

	$scope.RemoveProfile = function( index: number ) {
		$scope.selectedGroup.punchout_profiles[ index ].deleted = true;
	};
}
