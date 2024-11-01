import Papa from 'papaparse';
import template from './purchasing-cost-sheets.component.html';

export const PurchasingCostSheetsComponent: ng.IComponentOptions = {
	template,
	controller: PurchasingCostSheetsController,
};

function PurchasingCostSheetsController(
	$scope: any,
	$timeout: ng.ITimeoutService,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	ConfirmModal: any,
	Settings: any,
	Debug: any,
	Utils: any,
	Localized: any,
	SearchModal: any,
	$window: ng.IWindowService,
) {
	this.breadcrumbs = [
		{ name: 'Purchasing', state: 'purchasing.page' },
		{ name: 'Cost Sheets', state: 'purchasing-suppliers' },
	];

	/**
	 * Sets the active tab based on whether it matches a index of accessible tabs.
	 *
	 * @param {number} tab
	 * @return {number | Object} Sets activeTab to the tab number, or reloads the state to reset the activeTab.
	 */
	const setActiveTab = ( tab: number ) => {
		const index = [ 0, 1, 3, 4 ];
		if ( index.includes( tab ) ) {
			return $scope.activeTab = tab;
		}
		return $state.go( $state.current, { activeTab: 0 }, { reload: true } );
	};

	setActiveTab( parseInt( $stateParams.activeTab ) );
	$scope.loading = false;
	$scope.loadingMore = false;
	$scope.productsLoading = false;
	$scope.saving = false;
	$scope.uploading = false;
	$scope.saved = false;
	$scope.loadingMore = false;
	$scope.costSheetEndpoint = localized.apiURL + '/admin/purchasing/cost-sheet/';
	$scope.productEndpoint = localized.apiURL + '/admin/products/';
	$scope.vendorEndpoint = localized.apiURL + '/admin/purchasing/vendors/';
	$scope.supplierEndpoint = localized.apiURL + '/admin/punchout/suppliers/';
	$scope.docProfileEndpoint = localized.apiURL + '/admin/purchasing/document-profile/';
	$scope.batchEndpoint = localized.apiURL + '/admin/purchasing/cost-sheet/batch/';
	$scope.costSheets = [];
	$scope.costSheet = {};
	$scope.vendor = {};
	$scope.supplier = {};
	$scope.transmitting_document_profile = {};
	$scope.receiving_document_profile = {};
	$scope.document_profiles = {};
	$scope.selectedBatch = {};
	$scope.addParams = {
		costs: [],
	};
	$scope.editName = false;
	$scope.updatedCosts = [];
	$scope.editIndex = -1;
	$scope.object = Object;
	$scope.myFile = {};
	$scope.showChanges = false;
	$scope.rppValues = [ 15, 30, 50, 100 ];
	$scope.searchParams = {
		q: '',
		searchBy: '',
		sortBy: '',
		sortType: '',
		rpp: $scope.rppValues[ 0 ],
	};

	$scope.sortBatchParams = {
		sort_by: 'batch_id',
		sort_type: '',
		status: 'pending',
	};
	$scope.sortBatchParams.status = 'any';
	$scope.batchListOptions = {
		any: 'All',
		pending: 'Pending',
		confirmed: 'Confirmed',
		processing: 'Processing',
		processed: 'Processed',
	};
	$scope.sortAscending = true;

	//FACTORIES
	$scope.admin = Admin;
	$scope.confirm = ConfirmModal;
	$scope.settings = Settings;
	$scope.localized = Localized;
	$scope.utils = Utils;

	//FUNCTIONS

	$scope.LoginCallback = function() {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};

	$scope.TabChanged = function( i: number ) {
		$scope.activeTab = i;
		$scope.loading = true;
		switch ( $scope.activeTab ) {
			//Only retrieve new index if no data is present
			//This way previous searches are retained
			case 0:
				if ( ! $scope.costSheets.data ) {
					$scope.Index();
				}
				break;
			case 2:
				if ( $scope.costSheet.id ) {
					$scope.searchParams = {
						q: '',
						searchBy: '',
						sortBy: '',
						sortType: '',
						rpp: $scope.rppValues[ 0 ],
					};
					$scope.Show( $scope.costSheet.id );
				}
				break;
			case 4:
				$scope.BatchIndex();
				break;
			case 5:
				$scope.ShowBatch( $scope.selectedBatch.id );
				break;
		}

		$scope.loading = false;
	};

	$scope.ChangeTab = function( tab: number ) {
		$scope.activeTab = tab;
	};

	$scope.SortIndex = function( sortBy: string ) {
		$scope.sortAscending = ( $scope.searchParams.sortBy === sortBy ) ? ! $scope.sortAscending : true;
		$scope.searchParams.sortBy = sortBy;
		$scope.searchParams.sortType = $scope.sortAscending ? 'asc' : 'desc';
		$scope.Index( $scope.searchParams.page );
	};

	//Index
	$scope.Index = function( page: number ) {
		$scope.loadingMore = true;
		$scope.searchParams.page = page || 1;
		const req = {
			method: 'GET',
			url: $scope.costSheetEndpoint,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.costSheets = resp.cost_sheets;
			$scope.vendors = resp.vendors;
			$scope.suppliers = resp.suppliers;
			$scope.document_profiles = resp.document_profiles;
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loadingMore = false;
			$scope.loading = false;
		} );
	};

	//Show
	$scope.Show = function( id: number ) {
		$scope.loading = true;
		$scope.costSheet.id = id;
		const req = {
			method: 'GET',
			url: $scope.costSheetEndpoint + id,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.costSheet = resp.cost_sheet;
			$scope.costSheet.cost_margin *= 100;
			$scope.vendors = resp.vendors;
			$scope.suppliers = resp.suppliers;
			$scope.document_profiles = resp.document_profiles;
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.showChanges = false;
			$scope.loading = false;
		} );
	};

	//Store
	$scope.Store = function() {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.costSheetEndpoint,
			data: $scope.addParams,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			if ( ! resp.errors.length ) {
				$scope.addParams = {};
				$scope.vendor = {};
				$scope.supplier = {};
				$scope.Show( resp.cost_sheet.id );
				$scope.TabChanged( 2 );
			}
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	//Update
	$scope.Update = function( id: number ) {
		$scope.loading = true;
		$scope.updatedCosts.forEach( function( cost: any ) {
			if ( cost.action === 'remove' ) {
				cost.value.cost = 0.00;
			}
			$scope.costSheet.costs.data.push( cost.value );
		} );
		$scope.costSheet.costs = $scope.costSheet.costs.data;
		const req = {
			method: 'PUT',
			url: $scope.costSheetEndpoint + id,
			data: $scope.costSheet,
		};
		Utils.getHttpPromise( req ).then( function() {
			$scope.updatedCosts = [];
			$scope.Show( id );
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	//Delete
	$scope.Delete = function( id: number ) {
		const callback = {
			confirm() {
				$scope.loading = true;
				const req = {
					method: 'DELETE',
					url: $scope.costSheetEndpoint + id,
				};
				Utils.getHttpPromise( req ).then( function() {
					$scope.costSheet = {};
					$scope.activeTab = 0;
					$scope.Index();
				}, function( errResp: Error ) {
					Debug.log( errResp );
				} ).finally( function() {
					$scope.loading = false;
				} );
			},
			cancel() { },
		};
		$scope.confirm.Show( callback, 'Delete Cost Sheet?', 'This action cannot be undone.', 'Back', 'DELETE' );
	};

	$scope.ChangeBatchTab = function( batchId: number ) {
		$scope.activeTab = 5;
		$scope.selectedBatch.id = batchId;
	};

	$scope.ChangeEdit = function() {
		$scope.editName = ! $scope.editName;
	};

	$scope.ConfirmBatch = function() {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: $scope.batchEndpoint + 'confirm',
			data: {
				id: $scope.selectedBatch.id,
			},
		};
		Utils.getHttpPromise( req ).then( function() {
			$scope.selectedBatch = null;
			$scope.activeTab = 4;
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	$scope.SearchResults = function( resp: any ) { //callback that is used by the search modal
		if ( $scope.activeTab === 1 ) {
			if ( $scope.addParams.costs ) {
				resp.forEach( function( product: any ) {
					$scope.addParams.costs.push( product );
					// eslint-disable-next-line no-shadow
					const currentIds = $scope.addParams.costs.map( function( product: any ) {
						return product.value.product_id;
					} );
					if ( currentIds.includes( product.value.product_id ) ) {
						$scope.addParams.costs[ $scope.addParams.costs.length - 1 ].cost = product.value.cost;
					}
				} );
			} else {
				$scope.addParams.costs = [];
			}
		} else if ( $scope.activeTab === 2 ) {
			const currentIds = $scope.updatedCosts.map( function( item: any ) {
				return item.value.product_id;
			} );
			$scope.updatedCosts = [];
			resp.forEach( function( item: any ) {
				const included = currentIds.includes( item.value.product_id );
				if ( item.action === 'add' ) {
					$scope.updatedCosts.push( {
						action: 'add',
						value: {
							product_id: item.value.product_id,
							sku: item.value.sku,
							vendor_sku: item.value.sku,
							uomid: item.value.uomid,
							uomqty: item.value.uomqty,
							cost: included ? item.value.cost : 0.00,
							product: included ? item.value.product : item.value,
							image: item.value.image,
						},
					} );
				} else if ( item.action === 'remove' ) {
					$scope.updatedCosts.push( item );
				}
			} );
		}
	};

	$scope.editParams = function( item: any ) {
		for ( let i = 0; i < $scope.updatedCosts.length; i++ ) {
			if ( $scope.updatedCosts[ i ].value.product_id === item.product_id ) {
				if ( $scope.updatedCosts[ i ].action === 'remove' ) {
					return;
				}
				$scope.updatedCosts[ i ].value.cost = item.cost;
				return;
			}
		}
		$scope.updatedCosts.push( {
			action: 'edited',
			value: item,
		} );
	};

	$scope.ShowChanges = function() {
		$scope.showChanges = ! $scope.showChanges;
	};

	$scope.OpenSearchModalUpdate = function() {
		let callback = {};
		const config = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.productEndpoint,
						params: {
							q: '',
							excludedField: 'cost_sheet_index_id',
							excludedId: $scope.costSheet.id,
							excludedTable: 'cost_sheets',
						},
					},
					relationships: [ 'products' ],
					fields: [ 'sku', 'image', 'description', 'status' ],
					fieldPrefixes: [ '', '', '', 'Status: ' ],
					id: 'product_id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url: $scope.costSheetEndpoint + $scope.costSheet.id,
						params: {
							q: '',
						},
					},
					relationships: [ 'cost_sheet', 'costs' ],
					fields: [ 'sku', 'image', 'description', 'cost' ],
					fieldPrefixes: [ '', '', '', 'Cost: ' ],
					id: 'product_id',
				},
			],
			updatedItems: $scope.cost,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel() { },
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, $scope.costSheet.sheet, config, 'Add items' );
	};

	$scope.OpenSearchModalCostSheetsIndex = function() {
		let callback = {};
		const config = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.costSheetEndpoint,
						params: {
							q: '',
						},
					},
					relationships: [ 'cost_sheets' ],
					fields: [ 'id', 'name' ],
					fieldPrefixes: [ 'ID: ', '' ],
					id: 'id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm( resp: any ) {
				$scope.uploadCostSheetID = resp[ 0 ].value.id;
				$scope.uploadCostSheetName = resp[ 0 ].value.name;
			},
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, 'Select Cost Sheet', config, 'Add Cost Sheet' );
	};

	$scope.RemoveUploadFile = function() {
		$scope.batchUpload = null;
		$scope.localized.PushResponseMsg( {
			type: 'danger',
			message: 'File Successfully Removed',
		} );
	};

	$scope.setFile = function( element: HTMLFormElement ) {
		// eslint-disable-next-line no-shadow
		$scope.$apply( function( $scope: any ) {
			$scope.theFile = element.files[ 0 ];
		} );
		const totalBytes = $scope.theFile.size;
		if ( totalBytes < 1000000 ) {
			$scope.fileSize = Math.floor( totalBytes / 1000 ) + 'KB';
			Debug.log( 'FileSize: ', $scope.fileSize, ' KB' );
		} else {
			$scope.fileSize = Math.floor( totalBytes / 1000000 ) + 'MB';
			Debug.log( 'FileSize: ', $scope.fileSize, ' MB' );
		}
		Debug.log( 'File Size: ', $scope.fileSize );
		const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
		if ( regex.test( $scope.theFile.name.toLowerCase() ) ) {
			if ( typeof ( FileReader ) !== 'undefined' ) {
				const reader: any = new FileReader();
				reader.onload = function() {
					// eslint-disable-next-line no-undef
					Papa.parse( reader.result, {
						complete( results ) {
							const rows: any[] = [];
							for ( let i = 0; i <= results.data.length; i++ ) {
								const info = results.data[ i ];
								const row: any[] = [];
								angular.forEach( info, ( val, key ) => {
									row[ key ] = val;
								} );
								rows.push( row );
							}
							// eslint-disable-next-line no-shadow
							$scope.$apply( function( $scope: any ) {
								$scope.batchUpload = rows;
								$scope.IsVisible = true;
							} );

							Debug.log( 'Finished: ', results.data );
						},
					} );
					$scope.setUploading();
				};

				reader.readAsText( $scope.theFile );
			} else {
				$window.alert( 'This browser does not support HTML5.' );
			}
		} else {
			$scope.batchUpload = null;
			$scope.theFile = null;
			$scope.setUploading();
			$window.alert( 'Please upload a valid CSV file.' );
		}
	};

	$scope.setUploading = function() {
		// eslint-disable-next-line no-shadow
		$scope.$apply( function( $scope: any ) {
			$scope.uploading = ! $scope.uploading;
		} );
	};

	$scope.SortBatchIndex = function( sortBy: string ) {
		$scope.sortAscending = ( $scope.sortBatchParams.sort_by === sortBy ) ? ! $scope.sortAscending : true;
		$scope.sortBatchParams.sort_by = sortBy;
		$scope.sortBatchParams.sort_type = $scope.sortAscending ? 'asc' : 'desc';
		$scope.BatchIndex();
	};

	//Index
	$scope.BatchIndex = function() {
		const req = {
			method: 'GET',
			url: $scope.batchEndpoint,
			params: $scope.sortBatchParams,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.batches = resp.search_results;
			let again = false;
			for ( let i = 0; i < $scope.batches.length; i++ ) {
				if ( $scope.batches[ i ].status === 'processing' && $scope.activeTab === 4 ) {
					again = true;
					break;
				}
			}
			if ( again ) {
				$timeout( function() {
					$scope.BatchIndex();
				}, 5000 );
			}
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	$scope.ShowBatch = function( batchId: number ) {
		$scope.selectedBatch.batch_id = batchId;
		$scope.activeTab = 5;
		const req = {
			method: 'GET',
			url: $scope.batchEndpoint + 'view',
			params: {
				id: batchId,
			},
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.selectedBatch = resp.batches[ 0 ];
			$scope.batchHeaders = resp.batches[ 0 ].columns;
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	/**
	 * Upload the batch file that has been set.
	 */
	$scope.UploadBatch = function() {
		$scope.loading = true;
		const fd = new FormData();
		fd.append( 'file', $scope.theFile );
		fd.append( 'id', $scope.uploadCostSheetID );
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
			if ( resp.errors.length === 0 ) {
				$scope.selectedBatch = {
					batch_id: resp.batch_id,
				};
				$scope.activeTab = 5;
				$scope.localized.PushResponseMsg( {
					type: 'success',
					message: 'File Successfully Uploaded',
				} );
			}
		}, function( errResp: Error ) {
			Debug.log( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};
}

PurchasingCostSheetsController.$inject = [
	'$scope',
	'$timeout',
	'$state',
	'$stateParams',
	'Admin',
	'ConfirmModal',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
	'SearchModal',
	'$window',
];
