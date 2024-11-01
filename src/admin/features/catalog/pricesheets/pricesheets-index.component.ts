import Papa from 'papaparse';
import template from './pricesheets-index.component.html';
export const PricesheetsIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'$timeout',
	'$window',
	'$state',
	'$stateParams',
	'Admin',
	'Debug',
	'Localized',
	'PriceSheets',
	'SearchModal',
	'Settings',
	'Utils',
	'ViewModal',
];

function controller(
	$scope: any,
	$timeout: ng.ITimeoutService,
	$window: ng.IWindowService,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Debug: any,
	Localized: any,
	PriceSheets: any,
	SearchModal: any,
	Settings: any,
	Utils: any,
	ViewModal: any,
) {
	const vm = this;
	vm.changeTab = changeTab;
	vm.deletePricesheet = deletePricesheet;

	/**
	 * Initialization
	 */
	this.init = () => {
		this.breadcrumbs = [
			{ name: 'Catalog', state: 'catalog.page' },
			{ name: 'Price Sheets', state: 'catalog.pricesheets.index' },
		];

		$scope.activeTab = parseInt( $stateParams.activeTab );
		$scope.addParams = {
			products: [],
		};
		$scope.batchEndpoint = localized.apiURL + '/admin/price-sheet/batch/';
		$scope.batchListOptions = {
			any: 'All',
			pending: 'Pending',
			confirmed: 'Confirmed',
			processing: 'Processing',
			processed: 'Processed',
		};
		$scope.editIndex = -1;
		$scope.editName = false;
		$scope.isAuthed = Admin.Authed();
		$scope.loading = true;
		$scope.loadingMore = false;
		$scope.myFile = {};
		$scope.object = Object;
		$scope.pricesheetEndpoint = localized.apiURL + '/admin/pricesheets/';
		$scope.productEndpoint = localized.apiURL + '/admin/products/';
		$scope.productsLoading = false;
		$scope.saved = false;
		$scope.saving = false;
		$scope.selectedPricesheet = null;
		$scope.searchTerm = '';
		$scope.showChanges = false;
		$scope.updatedPricesheetItems = [];
		$scope.uploading = false;
		$scope.rppValues = [ 15, 30, 50, 100 ];
		vm.searchOptions = {
			price_sheet_id: 'ID',
			sheet: 'Price Sheet',
			site_id: 'Site ID',
			gp_price_sheet: 'GP Price Sheet',
		};
		$scope.searchParams = {
			rpp: $scope.rppValues[ 0 ], // Must be defined after rppValues is declared.
		};
		$scope.sortBatchParams = {
			sort_by: 'batch_id',
			sort_type: '',
			status: 'any',
		};

		vm.allPrShSearchParams = {
			page: 1,
			q: '',
			searchBy: '',
			sortBy: '',
			sortType: '',
			rpp: $scope.rppValues[ 0 ], // Must be defined after rppValues is declared.
		};
		vm.sortAscending = true;

		//If the view tab is selected, redirect to the search page since selected product is null
		if ( $scope.activeTab === 2 || $scope.activeTab === 5 ) {
			$scope.activeTab = 0;
			$scope.TransitionState();
		}
	};
	this.init();

	//FUNCTIONS
	$scope.LoginCallback = function() {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};
	$scope.SearchResults = function( resp: any ) { //callback that is used by the search modal
		if ( $scope.activeTab === 1 ) {
			if ( $scope.addParams.products ) {
				resp.forEach( function( product: any ) {
					$scope.addParams.products.push( product );
					// eslint-disable-next-line no-shadow
					const currentIds = $scope.addParams.products.map( function( product: any ) {
						return product.value.product_id;
					} );
					if ( currentIds.includes( product.value.product_id ) ) {
						$scope.addParams.products[ $scope.addParams.products.length - 1 ].price = product.value.price;
					}
				} );
			} else {
				$scope.addParams.products = [];
			}
		} else if ( $scope.activeTab === 2 ) {
			const currentIds = $scope.updatedPricesheetItems.map( function( item: any ) {
				return item.value.product_id;
			} );
			$scope.updatedPricesheetItems = [];
			resp.forEach( function( item: any ) {
				const included = currentIds.includes( item.value.product_id );
				if ( item.action === 'add' ) {
					$scope.updatedPricesheetItems.push( {
						action: 'add',
						value: {
							product_id: item.value.product_id,
							sku: item.value.sku,
							price: included ? item.value.price : 0.00,
							product: included ? item.value.product : item.value,
						},
					} );
				} else if ( item.action === 'remove' ) {
					$scope.updatedPricesheetItems.push( item );
				}
			} );
		} else if ( $scope.activeTab === 3 ) {
			$scope.uploadPricesheetId = resp[ 0 ].value.price_sheet_id;
			$scope.uploadPricesheetName = resp[ 0 ].value.sheet;
		}
	};
	$scope.AddPricesheet = function( id: number | null ) { // If id is null, we are adding new price sheet
		$scope.loading = true;
		const updateParams: any = {
			products: [],
		};
		let isMissingNameOrProducts = false;
		let req: any = {};

		// Update price sheet
		if ( id ) {
			updateParams.sheet = $scope.selectedPricesheet.sheet;
			updateParams.default_price_sheet = $scope.selectedPricesheet.default_price_sheet;
			updateParams.site_id = $scope.selectedPricesheet.site_id;
			updateParams.gp_price_sheet = $scope.selectedPricesheet.gp_price_sheet;
			for ( let i = 0; i < $scope.updatedPricesheetItems.length; i++ ) {
				if ( $scope.updatedPricesheetItems[ i ].value.price.includes( '$' ) ) {
					$scope.updatedPricesheetItems[ i ].value.price = $scope.updatedPricesheetItems[ i ].value.price.slice( 1, $scope.updatedPricesheetItems[ i ].value.price.length );
				}
				updateParams.products.push( {
					product_id: $scope.updatedPricesheetItems[ i ].value.product_id,
					sku: $scope.updatedPricesheetItems[ i ].value.sku,
					price: $scope.updatedPricesheetItems[ i ].action === 'remove' ? 0.00 : $scope.updatedPricesheetItems[ i ].value.price,
					// 'gsa', 'ability_one', 'core_list'
				} );
			}
			req = {
				method: 'PUT',
				url: $scope.pricesheetEndpoint + id,
				data: updateParams,
			};

			// Add new price sheet
		} else if ( $scope.addParams.name && $scope.addParams.products ) {
			updateParams.sheet = $scope.addParams.name;
			updateParams.default_price_sheet = $scope.addParams.default_price_sheet || false;
			updateParams.site_id = $scope.addParams.site_id;
			updateParams.gp_price_sheet = $scope.addParams.gp_price_sheet;
			for ( let j = 0; j < $scope.addParams.products.length; j++ ) {
				if ( $scope.addParams.products[ j ].value.price ) {
					if ( $scope.addParams.products[ j ].value.price.includes( '$' ) ) {
						$scope.addParams.products[ j ].value.price = $scope.addParams.products[ j ].value.price.slice( 0, $scope.addParams.products[ j ].value.price.length );
					}
					updateParams.products.push( {
						product_id: $scope.addParams.products[ j ].value.product_id,
						sku: $scope.addParams.products[ j ].value.sku,
						price: $scope.addParams.products[ j ].value.price,
						// 'gsa', 'ability_one', 'core_list'
					} );
				}
			}
			req = {
				method: 'POST',
				url: $scope.pricesheetEndpoint,
				data: updateParams,
			};
		} else {
			isMissingNameOrProducts = true;
		}
		if ( ! isMissingNameOrProducts ) {
			Utils.getHttpPromise( req ).then( function( resp: any ) {
				if ( ! resp.errors.length ) {
					if ( ! id ) {
						$scope.selectedPricesheet = {
							price_sheet_id: resp.price_sheet_id,
							sheet: req.data.sheet,
						};
						$scope.addParams = {};
						$scope.activeTab = 2;
					} else {
						$scope.TabChanged( 2 );
						$scope.updatedPricesheetItems = [];
						$scope.showChanges = false;
					}
				}
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.loading = false;
			} );
		} else {
			$scope.loading = false;
		}
		$scope.editName = false;
	};
	$scope.ChangeBatchTab = function( tabIndex: number, batchIndex: number ) {
		$scope.activeTab = tabIndex;
		$scope.selectedBatch = $scope.batches[ batchIndex ];
	};
	$scope.ChangeEdit = function() {
		$scope.editName = ! $scope.editName;
	};

	/**
	 * @param {number} tabIndex        Tab index
	 * @param {number} pricesheetIndex Price sheet index
	 */
	function changeTab( tabIndex: number, pricesheetIndex: number ) {
		vm.isConfirmingDeletion = false;
		$scope.activeTab = tabIndex;
		$scope.selectedPricesheet = $scope.pricesheets.data[ pricesheetIndex ];
	}

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
			$scope.activeTab = 4;
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};

	/**
	 * @param {number} id Price sheet ID
	 */
	function deletePricesheet( id: number ) {
		vm.isDeleting = true;
		PriceSheets.deletePriceSheet( id )
			.then( () => {
				vm.isDeleting = false;
				vm.isConfirmingDeletion = false;
				$scope.activeTab = 0;
				$scope.selectedPricesheet = null;
			} );
	}

	$scope.editParams = function( pricesheetItem: any ) {
		for ( let i = 0; i < $scope.updatedPricesheetItems.length; i++ ) {
			if ( $scope.updatedPricesheetItems[ i ].value.product_id === pricesheetItem.product_id ) {
				if ( $scope.updatedPricesheetItems[ i ].action === 'remove' ) {
					return;
				}
				$scope.updatedPricesheetItems[ i ].value.price = pricesheetItem.price;
				return;
			}
		}
		$scope.updatedPricesheetItems.push( {
			action: 'edited',
			value: pricesheetItem,
		} );
	};
	$scope.EditPrice = function( index: number ) {
		$scope.editIndex = index;
	};
	$scope.RemoveUploadFile = function() {
		$scope.pricesheetUpload = null;
		Localized.setNotification( {
			type: 'danger',
			message: 'File Successfully Removed',
		} );
	};
	$scope.SearchCancelled = function() { //callback that is used by the search modal

	};
	$scope.SearchPricesheet = function( page: number ) {
		$scope.productsLoading = true;
		$scope.searchParams.page = page || 1;
		const req = {
			method: 'GET',
			url: $scope.pricesheetEndpoint + $scope.selectedPricesheet.price_sheet_id,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise( req ).then( function( resp: any ) {
			$scope.selectedPricesheet = resp.pricesheet;
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.productsLoading = false;
		} );
	};

	this.searchPricesheets = () => {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: $scope.pricesheetEndpoint,
			params: vm.allPrShSearchParams,
		};
		Utils.getHttpPromise( req )
			.then( ( resp: any ) => {
				$scope.pricesheets = resp.pricesheets;
			}, ( errResp: Error ) => {
				Debug.error( errResp );
			} ).finally( () => {
				$scope.loadingMore = false;
			} );
	};

	this.setPage = ( page: number ) => {
		this.allPrShSearchParams.page = page;
		this.searchPricesheets();
	};

	this.setRpp = ( rpp: number ) => {
		this.allPrShSearchParams.rpp = rpp;
		this.searchPricesheets();
	};

	this.setQuery = ( query: string, searchBy: string ) => {
		this.allPrShSearchParams.page = 1; // Reset page when query changes.
		this.allPrShSearchParams.q = query;
		this.allPrShSearchParams.searchBy = searchBy;
		$scope.searchTerm = this.allPrShSearchParams.q;
		$scope.searchedBy = this.allPrShSearchParams.searchBy;
		this.searchPricesheets();
	};

	$scope.SetDefault = function() {
		if ( $scope.activeTab === 2 ) {
			$scope.selectedPricesheet.default_price_sheet = true;
		}
		if ( $scope.activeTab === 1 ) {
			$scope.addParams.default_price_sheet = true;
		}
	};

	$scope.setFile = function( element: HTMLFormElement ) {
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
							const products: any = [];
							for ( let i = 0; i <= results.data.length; i++ ) {
								const info = results.data[ i ];
								const product: any = [];
								angular.forEach( info, ( val, key ) => {
									product[ key ] = val;
								} );
								products.push( product );
							}
							// eslint-disable-next-line no-shadow
							$scope.$apply( function( $scope: any ) {
								$scope.pricesheetUpload = products;
								$scope.IsVisible = true;
							} );
						},
					} );
					$scope.setUploading();
				};

				reader.readAsText( $scope.theFile );
			} else {
				$window.alert( 'This browser does not support HTML5.' );
			}
		} else {
			$scope.pricesheetUpload = null;
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
	$scope.ShowChanges = function() {
		$scope.showChanges = ! $scope.showChanges;
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

	this.changeSortBy = ( sortBy: string, e: Event ) => {
		e.preventDefault();
		vm.sortAscending = ( vm.allPrShSearchParams.sortBy === sortBy ) ? ! vm.sortAscending : true;
		vm.allPrShSearchParams.sortBy = sortBy;
		vm.allPrShSearchParams.sortType = vm.sortAscending ? 'asc' : 'desc';
		this.searchPricesheets();
	};

	$scope.TabChanged = function( i: number ) {
		$scope.activeTab = i;
		Settings.errors = {};
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		let req: any = {
			method: 'GET',
			url: $scope.pricesheetEndpoint,
		};

		// use the switch below to call any functions needed for each tab. i.e. api calls, funcitonality, etc.
		switch ( i ) {
			case 0:
				Utils.getHttpPromise( req ).then( function( resp: any ) {
					$scope.pricesheets = resp.pricesheets;
				}, function( errResp: Error ) {
					Debug.error( errResp );
				} ).finally( function() {
					$scope.loading = false;
				} );
				break;
			case 1:
				$scope.loading = false;
				break;
			case 2:
				req.url += $scope.selectedPricesheet.price_sheet_id;
				Utils.getHttpPromise( req ).then( function( resp: any ) {
					$scope.selectedPricesheet = resp.pricesheet;
				}, function( errResp: Error ) {
					Debug.error( errResp );
				} ).finally( function() {
					$scope.loading = false;
				} );
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
					url: $scope.batchEndpoint + 'view',
					params: {
						batch_id: $scope.selectedBatch.batch_id,
					},
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
	$scope.TransitionState = function() {
		$state.go( 'catalog.pricesheets.index', { activeTab: $scope.activeTab } );
	};
	$scope.OpenSearchModalAdd = function() {
		let callback = {};
		const config = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.productEndpoint,
						params: {
							q: '',
						},
					},
					relationships: [ 'products' ],
					fields: [ 'sku', 'image', 'description', 'status' ],
					fieldPrefixes: [ '', '', '', 'Status: ' ],
					id: 'product_id',
					selectOne: false,
				},
			],
			updatedItems: $scope.addParams.products,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, $scope.addParams.name || 'New Price Sheet', config, 'Add items' );
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
							excludedField: 'price_sheet_id',
							excludedId: $scope.selectedPricesheet.price_sheet_id,
							excludedTable: 'price_sheets',
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
						url: $scope.pricesheetEndpoint + $scope.selectedPricesheet.price_sheet_id,
						params: {
							q: '',
						},
					},
					relationships: [ 'pricesheet', 'pricesheetItems', 'product' ],
					fields: [ 'sku', 'image', 'description', 'price' ],
					fieldPrefixes: [ '', '', '', 'Price: ' ],
					id: 'product_id',
				},
			],
			updatedItems: $scope.updatedPricesheetItems,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, $scope.selectedPricesheet.sheet, config, 'Add items' );
	};
	$scope.OpenSearchModalPricesheet = function() {
		let callback = {};
		const config = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.pricesheetEndpoint,
						params: {
							q: '',
						},
					},
					relationships: [ 'pricesheets' ],
					fields: [ 'price_sheet_id', 'sheet' ],
					fieldPrefixes: [ 'ID: ', '' ],
					id: 'price_sheet_id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, 'Select Price Sheet', config, 'Add Price Sheet' );
	};
	$scope.OpenViewModal = function( product: any ) {
		$scope.callback = {};
		const callback = {
			confirm() {
				$scope.TabChanged( 3 );
			},
			cancel: $scope.SearchCancelled,
		};
		ViewModal.Show( callback, 'Quick View: ' + product.sku, product );
	};
	$scope.postUpload = function( index: number, id: number ) {
		$scope.selectedBatch = {
			batch_id: id,
		};
		$scope.activeTab = index;
	};
	$scope.UploadPricesheet = function() {
		$scope.loading = true;
		const fd = new FormData();
		fd.append( 'file', $scope.theFile );
		fd.append( 'price_sheet_id', $scope.uploadPricesheetId );
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
				$scope.postUpload( 5, resp.batch_id );
				Localized.setNotification( {
					type: 'success',
					message: 'File Successfully Uploaded',
				} );
			}
		}, function( errResp: Error ) {
			Debug.error( errResp );
		} ).finally( function() {
			$scope.loading = false;
		} );
	};
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
				if ( $scope.batches[ i ].status === 'processing' && $scope.activeTab === 4 ) {
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
}

