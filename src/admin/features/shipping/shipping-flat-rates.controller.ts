( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.controller( 'ShippingFlatRatesController', ShippingFlatRatesController );

	ShippingFlatRatesController.$inject = [
		'$scope',
		'$rootScope',
		'$stateParams',
		'Admin',
		'Settings',
		'Debug',
		'Utils',
		'Localized',
		'SearchModal',
	];

	/**
	 * @param {Object} $scope       Angular service
	 * @param {Object} $rootScope   Angular service
	 * @param {Object} $stateParams UI Router service
	 * @param {Object} Admin        VendorFuel service
	 * @param {Object} Settings     VendorFuel service
	 * @param {Object} Debug        VendorFuel service
	 * @param {Object} Utils        VendorFuel service
	 * @param {Object} Localized    VendorFuel service
	 * @param {Object} SearchModal  VendorFuel service
	 */
	function ShippingFlatRatesController(
		$scope: any,
		$rootScope: any,
		$stateParams: ng.ui.IStateParamsService,
		Admin: any,
		Settings: any,
		Debug: any,
		Utils: any,
		Localized: any,
		SearchModal: any,
	) {
		this.init = () => {
			this.breadcrumbs = [
				{ name: 'Shipping', state: 'shipping.page' },
				{ name: 'Flat Rates', state: 'shipping.flat-rates.index' },
			];

			$scope.activeTab = parseInt( $stateParams.activeTab ) || 0;
			$scope.createFlatRate = { name: '', label: '', amount: 0.00, free_if_total: 0, free_order_total: 0.00, enabled: 0, modifiers: [] };
			$scope.del = 0;
			$scope.isAuthed = Admin.Authed();
			$scope.loading = true;
			$scope.rppValues = [ 15, 30, 50, 100 ];
			$scope.saved = false;
			$scope.saving = false;
			$scope.searchParams = {
				q: '',
				sortBy: '',
				sortType: '',
				rpp: $scope.rppValues[ 0 ],
			};
			$scope.selectedFlatRate = null;
			$scope.shippingFlatRateEndpoint = localized.apiURL + '/admin/shipping/flat-rate/';
			$scope.updatedCustomers = [];
		};
		this.init();

		this.isNotApplied = (): boolean => {
			if ( $scope.selectedFlatRate ) {
				if (
					! $scope.selectedFlatRate.customers.length &&
					! $scope.selectedFlatRate.groups.length &&
					! $scope.selectedFlatRate.pricesheets.length
				) {
					return true;
				}
			}
		};

		//FUNCTIONS
		$scope.updateModifiers = function( rateType: any, modType: number, index: number ) {
			if ( modType === 0 ) {
				if ( rateType.modifiers.length - $scope.del < 5 ) {
					rateType.modifiers.push( { amount: 0, order_total_min: 0, order_total_max: 0 } );
				}
			} else if ( modType === 1 ) {
				$scope.del += 1;
				// eslint-disable-next-line no-prototype-builtins
				if ( rateType.modifiers[ index ].hasOwnProperty( 'id' ) ) {
					rateType.modifiers[ index ].deleted = 1;
				} else {
					rateType.modifiers.splice( index, 1 );
				}
			}
			return false;
		};

		$scope.TabChanged = function( i: number ) {
			$scope.modifiers = [];
			if ( $scope.selectedFlatRate && $scope.selectedFlatRate.modifiers ) {
				$scope.selectedFlatRate.modifiers = [];
			}
			Localized.deleteNotifications();
			$scope.activeTab = i;
			Settings.errors = {};
			$scope.loading = true;
			$scope.saving = false;
			$scope.saved = false;
			const req = {
				method: 'GET',
				url: $scope.shippingFlatRateEndpoint,
			};
			switch ( i ) {
				case 0:
					Utils.getHttpPromise( req ).then( function( resp: any ) {
						$scope.flatRates = resp.shipping_flat_rates;
					}, function( errResp: Error ) {
						Debug.error( errResp );
					} ).finally( function() {
						$scope.loading = false;
					} );
					break;
				case 1:
					$scope.createFlatRate = { name: '', label: '', amount: 0.00, free_if_total: 0, free_order_total: 0.00, enabled: 0, modifiers: [] };
					$scope.loading = false;
					break;
				case 2:
					$scope.ShowFlatRate( $scope.selectedFlatRate.id );
					break;
			}
		};

		$scope.ShowFlatRate = function( id: number ) {
			const req = {
				method: 'GET',
				url: $scope.shippingFlatRateEndpoint,
			};
			req.url += id;
			Utils.getHttpPromise( req ).then( function( resp: any ) {
				$scope.selectedFlatRate = resp.shipping_flat_rate;
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				if ( $scope.selectedFlatRate && $scope.selectedFlatRate.modifiers ) {
					$scope.modifiers = angular.copy( $scope.selectedFlatRate.modifiers );
				}
				$scope.loading = false;
			} );
		};

		$scope.DeleteFlatRate = function() {
			$scope.deleting = true;
			const req = {
				method: 'DELETE',
				url: $scope.shippingFlatRateEndpoint + $scope.selectedFlatRate.id,
			};
			Utils.getHttpPromise( req ).then( function() {
				$scope.selectedFlatRate = null;
				$scope.activeTab = 0;
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.deleting = false;
			} );
		};
		$scope.ChangeTab = function( tabIndex: number, flatRateIndex: number ) {
			$scope.activeTab = tabIndex;
			$scope.selectedFlatRate = $scope.flatRates.data[ flatRateIndex ];
		};
		$scope.CreateFlatRate = function() {
			$scope.updating = true;
			const params = $scope.createFlatRate;
			const req = {
				method: 'POST',
				url: $scope.shippingFlatRateEndpoint,
				data: params,
			};
			Utils.getHttpPromise( req ).then( function( resp: any ) {
				if ( ! resp.errors || resp.errors.length <= 0 ) {
					$scope.selectedFlatRate = { id: resp.id };
					$scope.createFlatRate = { name: '', label: '', amount: 0.00, free_if_total: 0, free_order_total: 0.00, enabled: 0, modifiers: [] };
					$scope.activeTab = 2;
					Localized.setNotification( {
						type: 'success',
						message: 'Map Successfully Removed',
					} );
				}
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.updating = false;
			} );
		};
		$scope.OpenCustomerSearchModal = function() {
			let callback = {};
			const config = {
				tabs: [
					{
						http: {
							method: 'GET',
							url: localized.apiURL + '/admin/customers/',
							params: {
								q: '',
								excludedField: 'shipping_flat_rate_id',
								excludedId: $scope.selectedFlatRate.id,
								excludedTable: 'shipping_flat_rate_customer',
							},
						},
						relationships: [ 'customers' ],
						fields: [ 'customer_id', 'name', 'email', 'status' ],
						fieldPrefixes: [ 'ID: ', '', '', 'Status: ' ],
						id: 'customer_id',
						selectOne: false,
					},
					{
						http: {
							method: 'GET',
							url: $scope.shippingFlatRateEndpoint + $scope.selectedFlatRate.id,
							params: {
								q: '',
							},
						},
						relationships: [ 'shipping_flat_rate', 'customerSearchItems' ],
						fields: [ 'customer_id', 'name', 'email', 'status' ],
						fieldPrefixes: [ 'ID: ', '', '', 'Status: ' ],
						id: 'customer_id',
					},
				],
				updatedItems: $scope.updatedCustomers,
			};
			callback = {
				confirm: $scope.customerSearchResults,
				cancel() {
					//Cancelled
				},
			};
			//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
			SearchModal.Show( callback, 'Select Customers', config, 'Add items' );
		};
		$scope.OpenGroupSearchModal = function() {
			let callback = {};
			const config = {
				tabs: [
					{
						http: {
							method: 'GET',
							url: localized.apiURL + '/admin/groups/',
							params: {
								q: '',
								excludedField: 'shipping_flat_rate_id',
								excludedId: $scope.selectedFlatRate.id,
								excludedTable: 'shipping_flat_rate_group',

							},
						},
						relationships: [ 'groups' ],
						fields: [ 'group_id', 'name' ],
						fieldPrefixes: [ 'ID: ', '' ],
						id: 'group_id',
						selectOne: false,
					},
					{
						http: {
							method: 'GET',
							url: $scope.shippingFlatRateEndpoint + $scope.selectedFlatRate.id,
							params: {
								q: '',
							},
						},
						relationships: [ 'shipping_flat_rate', 'groupSearchItems' ],
						fields: [ 'group_id', 'name' ],
						fieldPrefixes: [ 'ID: ', '' ],
						id: 'group_id',
					},
				],
				updatedItems: $scope.updatedGroups,
			};
			callback = {
				confirm: $scope.groupSearchResults,
				cancel() {
					//Cancelled
				},
			};
			//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
			SearchModal.Show( callback, 'Select Groups', config, 'Add items' );
		};
		$scope.OpenPriceSheetSearchModal = function() {
			let callback = {};
			const config = {
				tabs: [
					{
						http: {
							method: 'GET',
							url: localized.apiURL + '/admin/pricesheets/',
							params: {
								q: '',
								excludedField: 'shipping_flat_rate_id',
								excludedId: $scope.selectedFlatRate.id,
								excludedTable: 'shipping_flat_rate_price_sheet',
							},
						},
						relationships: [ 'pricesheets' ],
						fields: [ 'price_sheet_id', 'sheet' ],
						fieldPrefixes: [ 'ID: ', '' ],
						id: 'price_sheet_id',
						selectOne: false,
					},
					{
						http: {
							method: 'GET',
							url: $scope.shippingFlatRateEndpoint + $scope.selectedFlatRate.id,
							params: {
								q: '',
							},
						},
						relationships: [ 'shipping_flat_rate', 'priceSheetSearchItems' ],
						fields: [ 'price_sheet_id', 'sheet' ],
						fieldPrefixes: [ 'ID: ', '' ],
						id: 'price_sheet_id',
					},
				],
				updatedItems: $scope.updatedSheets,
			};
			callback = {
				confirm: $scope.sheetSearchResults,
				cancel() {
					//Cancelled
				},
			};
			//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
			SearchModal.Show( callback, 'Select Price Sheets', config, 'Add items' );
		};
		$scope.customerSearchResults = function( resp: any ) {
			if ( $scope.activeTab === 2 ) {
				$scope.updatedCustomers = [];
				resp.forEach( function( result: any ) {
					if ( result.action === 'add' ) {
						$scope.updatedCustomers.push( result );
						$scope.selectedFlatRate.customers.push( { customer_id: result.value.customer_id, status: result.value.status, name: result.value.name, email: result.value.email, action: 'add' } );
					}
					if ( result.action === 'unselect' ) {
						angular.forEach( $scope.selectedFlatRate.customers, function( val, key ) {
							if ( val.customer_id === result.value.customer_id ) {
								$scope.selectedFlatRate.customers.splice( key, 1 );
							}
						} );
					}
					if ( result.action === 'remove' ) {
						$scope.updatedCustomers.push( result );
						angular.forEach( $scope.selectedFlatRate.customers, function( val, key ) {
							if ( val.customer_id === result.value.customer_id ) {
								$scope.selectedFlatRate.customers[ key ].deleted = 1;
								$scope.selectedFlatRate.customers[ key ].action = 'remove';
							}
						} );
					}
					if ( result.action === 'deselect' ) {
						angular.forEach( $scope.selectedFlatRate.customers, function( val, key ) {
							if ( val.customer_id === result.value.customer_id ) {
								$scope.selectedFlatRate.customers.splice( key, 1 );
							}
						} );
					}
				} );
			}
		};
		$scope.customerCheck = function( customer: any ) {
			let check = false;
			angular.forEach( $scope.updatedCustomers, function( key ) {
				if ( key.value.id === customer.customer_id && key.action === 'remove' ) {
					check = true;
				}
			} );
			return check;
		};
		$scope.groupSearchResults = function( resp: any ) {
			if ( $scope.activeTab === 2 ) {
				$scope.updatedGroups = [];
				resp.forEach( function( result: any ) {
					if ( result.action === 'add' ) {
						$scope.updatedGroups.push( result );
						$scope.selectedFlatRate.groups.push( { group_id: result.value.group_id, name: result.value.name, action: 'add' } );
					}
					if ( result.action === 'unselect' ) {
						angular.forEach( $scope.selectedFlatRate.groups, function( val, key ) {
							if ( val.group_id === result.value.group_id ) {
								$scope.selectedFlatRate.groups.splice( key, 1 );
							}
						} );
					}
					if ( result.action === 'remove' ) {
						$scope.updatedGroups.push( result );
						angular.forEach( $scope.selectedFlatRate.groups, function( val, key ) {
							if ( val.group_id === result.value.group_id ) {
								$scope.selectedFlatRate.groups[ key ].deleted = 1;
								$scope.selectedFlatRate.groups[ key ].action = 'remove';
							}
						} );
					}
					if ( result.action === 'deselect' ) {
						angular.forEach( $scope.selectedFlatRate.groups, function( val, key ) {
							if ( val.group_id === result.value.group_id ) {
								$scope.selectedFlatRate.groups.splice( key, 1 );
							}
						} );
					}
				} );
			}
		};
		$scope.SearchShippingFlatRates = function( page: number, query: string ) {
			$scope.loadingMore = true;
			$scope.searchParams.q = query;
			$scope.searchTerm = $scope.searchParams.q;
			$scope.searchParams.page = page || 1;
			const endpoint = $scope.shippingFlatRateEndpoint;
			const params = $scope.searchParams;

			Utils.httpGet( endpoint, params )
				.then( function( resp: any ) {
					$scope.flatRates = resp.shipping_flat_rates;
				}, function( errResp: Error ) {
					Debug.error( errResp );
				} ).finally( function() {
					$scope.loadingMore = false;
				} );
		};
		$scope.OpenProductSearchModal = function() {
			let callback = {};
			const config = {
				tabs: [
					{
						http: {
							method: 'GET',
							url: localized.apiURL + '/admin/products/',
							params: {
								q: '',
								excludedField: 'shipping_flat_rate_id',
								excludedId: $scope.selectedFlatRate.id,
								excludedTable: 'shipping_flat_rate_restricted_items',

							},
						},
						relationships: [ 'products' ],
						fields: [ 'product_id', 'description' ],
						fieldPrefixes: [ 'ID: ', '' ],
						id: 'product_id',
						selectOne: false,
					},
					{
						http: {
							method: 'GET',
							url: $scope.shippingFlatRateEndpoint + $scope.selectedFlatRate.id,
							params: {
								q: '',
							},
						},
						relationships: [ 'shipping_flat_rate', 'restrictedSearchItems' ],
						fields: [ 'product_id', 'description' ],
						fieldPrefixes: [ 'ID: ', '' ],
						id: 'product_id',
					},
				],
				updatedItems: $scope.updatedProducts,
			};
			callback = {
				confirm: $scope.productSearchResults,
				cancel() {
					//Cancelled
				},
			};
			//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
			SearchModal.Show( callback, 'Select Products', config, 'Add products' );
		};
		$scope.productSearchResults = function( resp: any ) {
			if ( $scope.activeTab === 2 ) {
				$scope.updatedProducts = [];
				resp.forEach( function( result: any ) {
					if ( result.action === 'add' ) {
						$scope.updatedProducts.push( result );
						$scope.selectedFlatRate.restricted_items.push( { product_id: result.value.product_id, action: 'add' } );
					}
					if ( result.action === 'unselect' ) {
						angular.forEach( $scope.selectedFlatRate.restricted_items, function( val, key ) {
							if ( val.product_id === result.value.product_id ) {
								$scope.selectedFlatRate.restricted_items.splice( key, 1 );
							}
						} );
					}
					if ( result.action === 'remove' ) {
						$scope.updatedProducts.push( result );
						angular.forEach( $scope.selectedFlatRate.restricted_items, function( val, key ) {
							if ( val.product_id === result.value.product_id ) {
								$scope.selectedFlatRate.restricted_items[ key ].deleted = 1;
								$scope.selectedFlatRate.restricted_items[ key ].action = 'remove';
							}
						} );
					}
					if ( result.action === 'deselect' ) {
						angular.forEach( $scope.selectedFlatRate.restricted_items, function( val, key ) {
							if ( val.product_id === result.value.product_id ) {
								$scope.selectedFlatRate.restricted_items.splice( key, 1 );
							}
						} );
					}
				} );
			}
		};
		$scope.sheetSearchResults = function( resp: any ) {
			if ( $scope.activeTab === 2 ) {
				$scope.updatedSheets = [];
				resp.forEach( function( result: any ) {
					if ( result.action === 'add' ) {
						$scope.updatedSheets.push( result );
						$scope.selectedFlatRate.pricesheets.push( { id: result.value.price_sheet_id, price_sheet_id: result.value.price_sheet_id, name: result.value.sheet, action: 'add' } );
					}
					if ( result.action === 'unselect' ) {
						angular.forEach( $scope.selectedFlatRate.pricesheets, function( val, key ) {
							if ( val.price_sheet_id === result.value.price_sheet_id ) {
								$scope.selectedFlatRate.pricesheets.splice( key, 1 );
							}
						} );
					}
					if ( result.action === 'remove' ) {
						$scope.updatedSheets.push( result );
						angular.forEach( $scope.selectedFlatRate.pricesheets, function( val, key ) {
							if ( val.price_sheet_id === result.value.price_sheet_id ) {
								$scope.selectedFlatRate.pricesheets[ key ].deleted = 1;
								$scope.selectedFlatRate.pricesheets[ key ].action = 'remove';
							}
						} );
					}
					if ( result.action === 'deselect' ) {
						angular.forEach( $scope.selectedFlatRate.pricesheets, function( val, key ) {
							if ( val.price_sheet_id === result.value.price_sheet_id ) {
								$scope.selectedFlatRate.pricesheets.splice( key, 1 );
							}
						} );
					}
				} );
			}
		};
		$scope.UpdateFlatRate = function() {
			$scope.updating = true;
			const req = {
				method: 'PUT',
				url: $scope.shippingFlatRateEndpoint + $scope.selectedFlatRate.id,
				data: $scope.selectedFlatRate,
			};
			Utils.getHttpPromise( req ).then( function( resp: any ) {
				if ( resp.errors.length <= 0 ) {
					$scope.updateResults();
				}
			}, function( errResp: Error ) {
				Debug.error( errResp );
			} ).finally( function() {
				$scope.updating = false;
				$scope.ShowFlatRate( $scope.selectedFlatRate.id );
			} );
		};
		$scope.updateResults = function() {
			angular.forEach( $scope.updatedCustomers, function( result ) {
				if ( result.action === 'remove' ) {
					angular.forEach( $scope.selectedFlatRate.customers, function( val, key ) {
						if ( val.customer_id === result.value.customer_id ) {
							$scope.selectedFlatRate.customers.splice( key, 1 );
						}
					} );
				}
			} );
			angular.forEach( $scope.updatedGroups, function( result ) {
				if ( result.action === 'remove' ) {
					angular.forEach( $scope.selectedFlatRate.groups, function( val, key ) {
						if ( val.group_id === result.value.group_id ) {
							$scope.selectedFlatRate.groups.splice( key, 1 );
						}
					} );
				}
			} );
			angular.forEach( $scope.updatedSheets, function( result ) {
				if ( result.action === 'remove' ) {
					angular.forEach( $scope.selectedFlatRate.pricesheets, function( val, key ) {
						if ( val.price_sheet_id === result.value.price_sheet_id ) {
							$scope.selectedFlatRate.pricesheets.splice( key, 1 );
						}
					} );
				}
			} );
			$scope.updatedGroups = [];
			$scope.updatedCustomers = [];
			$scope.updatedPriceSheets = [];
		};
	}
}() );

