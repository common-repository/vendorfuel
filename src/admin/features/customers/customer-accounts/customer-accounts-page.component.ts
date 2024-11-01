import template from './customer-accounts-page.component.html';
declare const angular: ng.IAngularStatic;
import Papa from 'papaparse';

class Customer {
	pricesheet: {};
	promo_engine = true;
	group: any;
	status:'active'|'inactive'|'verified' = 'active';
	shipping_flat_rates: never[];
	punchout_suppliers: never[];
	password?: string;
	password_confirmation?: string;
	f1_name?: string;
	f1_replace_field?: string;
	f1_required?: boolean;
	f1_value?: Array<string>;
	f2_name?: string;
	f2_replace_field?: string;
	f2_required?: boolean;
	f2_value?: Array<string>;
	f3_name?: string;
	f3_required?: boolean;
	f3_value?: Array<string>;
	f4_name?: string;
	f4_required?: boolean;
	f4_value?: Array<string>;
	f5_name?: string;
	f5_required?: boolean;
	f5_value?: Array<string>;
	f6_name?: string;
	f6_required?: boolean;
	f6_value?: Array<string>;
	constructor() {
		this.pricesheet = {};
		this.punchout_suppliers = [];
		this.shipping_flat_rates = [];
	}
}

export const CustomerAccountsPage: ng.IComponentOptions = {
	template,
	controller: CustomerAccountsController,
};

CustomerAccountsController.$inject = [
	'$state',
	'$stateParams',
	'Admin',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
	'SearchModal',
	'customerAccountsService',
	'$uibModal',
];

function CustomerAccountsController(
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Settings: any,
	Debug: any,
	Utils: any,
	Localized: any,
	SearchModal: any,
	customerAccountsService: any,
	$uibModal: ng.ui.bootstrap.IModalService,
) {
	this.settings = Settings;

	this.$onInit = () => {
		this.breadcrumbs = [
			{ name: 'Customers', state: 'customers.page' },
			{ name: 'Accounts', state: 'customers.accounts.index' },
		];

		this.activeTab = parseInt( $stateParams.activeTab ) || 0;
		this.customer = new Customer();
		this.customerData = customerAccountsService.customerData();
		this.customerEndpoint = localized.apiURL + '/admin/customers/';
		this.customers = {};
		this.isAuthed = Admin.Authed();
		this.isLoading = false;
		this.isLoadingMore = false;
		this.isShowingPassword = false;
		this.limitTypes = {
			none: 'None',
			monthly: 'Monthly',
			quarterly: 'Quarterly',
			flat: 'Flat',
		};
		this.isCostCenterRequired = localized.settings.general.checkout.cost_center_option_required;
		this.passwordPattern = /(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*]{8,}/;
		this.replaceFields = {
			organization: 'Company/Organization',
			rr_po_num: 'Purchase Order Number',
			issuing_office: 'Issuing Office',
			cost_center_code: 'Cost Center Code',
			attention: 'Attention',
		};
		this.role = null;
		this.perPageValues = [ 15, 30, 50, 100 ];
		this.searchOptions = {
			id: 'ID',
			name: 'Name',
			email: 'Email',
		};
		this.searchParams = {
			page: 1,
			q: '',
			searchBy: '',
			orderBy: 'id',
			direction: 'asc',
			perPage: this.perPageValues[ 0 ], // Must be defined after perPageValues is declared.
		};
		this.searchTerm = '';
		this.selectedCustomer = $stateParams.customer || null;
		this.sortAscending = true;
		this.states = this.customerData.states;
		this.statuses = {
			active: 'Active',
			inactive: 'Inactive',
			unverified: 'Unverified',
		};
		this.updatedRates = [];

		//If the view tab is selected, redirect to the search page since selected product is null
		if ( this.activeTab === 2 && ! this.selectedCustomer ) {
			this.activeTab = 0;
		}
	};

	/**
	 * Cancels changing the user account password.
	 */
	this.cancelPasswordChange = () => {
		this.customer.password = null;
		this.customer.password_confirmation = null;
		this.isSettingNewPassword = false;
	};

	/**
	 * Changes the customer properties based on data returned from child component.
	 *
	 * @param key
	 * @param value
	 */
	this.changeCustomer = ( key: string, value: unknown ) => {
		this.customer[ key ] = value;
	};

	/**
	 * Gets store settings used for default prefix
	 */
	this.getDefaultPrefix = () => {
		Settings.store.Get().finally( () => {
			this.isLoading = false;
		} );
	};

	/**
	 * Updates store settings user for default prefix
	 */
	this.updateDefaultPrefix = () => {
		Settings.store.Set().finally( () => {
			this.isLoading = false;
		} );
	};

	/**
	 * @param {number} i Tab index
	 */
	this.tabChanged = ( i: number ) => {
		this.activeTab = i;
		Settings.errors = {};
		this.isLoading = true;
		const req: {
				method: string;
				url: string;
				params?: any;
			} = {
				method: 'GET',
				url: this.customerEndpoint,
			};
		switch ( i ) {
			case 0:
				this.searchCustomers();
				break;
			case 1:
				this.isLoading = false;
				this.customer = new Customer();
				break;
			case 2:
				req.url += this.selectedCustomer.id;
				Utils.getHttpPromise( req, 2 )
					.then( ( resp: any ) => {
						this.priceSheets = resp.price_sheets;
						this.roles = resp.roles;
						this.customer = this.sanitizeCustomer( resp.customer );
						this.suppliers = resp.suppliers;
						this.updatedRates = [];
					}, ( errResp: Error ) => {
						Debug.error( errResp );
					} ).finally( () => {
						this.isLoading = false;
					} );
				break;
			case 3:
				this.isLoading = false;
				break;
			case 6:
				this.getDefaultPrefix();
				break;
		}
	};

	/**
	 * @param {number} num Number
	 */
	this.addCustomCheckoutValue = ( num: number ) => {
		if ( this.activeTab === 2 ) {
			this.customer[ 'f' + num + '_value' ].push( '' );
		} else if ( this.activeTab === 1 ) {
			if ( this.customer[ 'f' + num + '_value' ] ) {
				this.customer[ 'f' + num + '_value' ].push( '' );
			} else {
				this.customer[ 'f' + num + '_value' ] = [];
				this.customer[ 'f' + num + '_value' ].push( '' );
			}
		}
	};

	this.addCustomer = () => {
		this.isLoading = true;
		const req = {
			method: 'POST',
			url: this.customerEndpoint,
			data: this.customer,
		};
		Utils.getHttpPromise( req, 2 )
			.then( ( resp: any ) => {
				if ( resp.errors.length <= 0 ) {
					this.selectedCustomer = resp.customer;
					this.customer = {};
					this.activeTab = 2;
				}
			}, ( errResp: Error ) => {
				Debug.error( errResp );
			} ).finally( () => {
				this.isLoading = false;
			} );
	};

	this.changeTab = ( tabIndex: number, customerIndex: number ) => {
		this.activeTab = tabIndex;
		this.selectedCustomer = this.customers.data[ customerIndex ];
	};

	this.checkPriceSheet = ( tabIndex: number ) => {
		if ( tabIndex === 1 ) {
			angular.forEach( this.priceSheets, ( sheet ) => {
				if ( this.customer.price_sheet_id === sheet.price_sheet_id ) {
					this.selectedSheet = sheet.sheet;
				}
			} );
		}
		if ( tabIndex === 2 ) {
			angular.forEach( this.priceSheets, ( sheet ) => {
				if ( this.customer.price_sheet_id === sheet.price_sheet_id ) {
					this.selectedSheet = sheet.sheet;
				}
			} );
		}
	};

	this.formatDate = ( date: string ) => {
		const dateOut = new Date( date );
		return dateOut;
	};

	this.goToProduct = ( product: any ) => {
		$state.go( 'catalog.products.index', { activeTab: 2, product } );
	};

	/**
	 */
	this.openGroupSearchModal = () => {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/groups/',
						params: {
							q: '',
						},
					},
					relationships: [ 'groups' ],
					fields: [ 'group_id', 'name', 'parent_group_id', 'default_price_sheet' ],
					fieldPrefixes: [ 'ID: ', '', 'Parent ID: ', 'Price Sheet: ' ],
					id: 'group_id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		SearchModal.Show( callback, this.customer.name, data, 'Add items' );
	};

	this.onCopy = ( copiedCustomer: any ) => {
		this.customer = copiedCustomer;
	};

	this.openRatesSearchModal = () => {
		let callback = {};
		const config = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: localized.apiURL + '/admin/shipping/flat-rate/',
						params: {
							q: '',
							excludedField: 'customer_id',
							excludedId: this.selectedCustomer.id,
							excludedTable: 'shipping_flat_rate_customer',
						},
					},
					relationships: [ 'shipping_flat_rates' ],
					fields: [ 'name', 'cost', 'enabled' ],
					fieldPrefixes: [ 'Name: ', 'Cost: ', 'Enabled: ' ],
					id: 'id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url: this.customerEndpoint + this.selectedCustomer.id,
					},
					relationships: [ 'customer', 'flatrates' ],
					fields: [ 'name', 'cost', 'enabled' ],
					fieldPrefixes: [ 'Name: ', 'Cost: ', 'Enabled: ' ],
					id: 'id',
					selectOne: false,
				},
			],
			updatedItems: this.updatedRates,
		};
		callback = {
			confirm: this.rateResults,
			cancel: this.searchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show( callback, 'Flat Rates', config, 'Add Shipping Rates' );
	};

	this.rateResults = ( resp: any ) => {
		if ( this.activeTab === 2 ) {
			this.updatedRates = [];
			resp.forEach( ( rate: any ) => {
				if ( rate.action === 'add' ) {
					this.updatedRates.push( rate );
					this.customer.shipping_flat_rates.push( { id: rate.value.id } );
				}
				if ( rate.action === 'unselect' ) {
					angular.forEach( this.customer.shipping_flat_rates, ( val, key ) => {
						if ( val.id === rate.value.id ) {
							this.customer.shipping_flat_rates.splice( key, 1 );
						}
					} );
				}
				if ( rate.action === 'remove' ) {
					this.updatedRates.push( rate );
					this.customer.shipping_flat_rates.push( { id: rate.value.id, deleted: 1 } );
				}
				if ( rate.action === 'deselect' ) {
					angular.forEach( this.customer.shipping_flat_rates, ( val, key ) => {
						if ( val.id === rate.value.id ) {
							this.customer.shipping_flat_rates.splice( key, 1 );
						}
					} );
				}
			} );
		}
	};

	this.rateCheck = ( rate: any ) => {
		let check = false;
		angular.forEach( this.updatedRates, ( key ) => {
			if ( key.value.id === rate.id && key.action === 'remove' ) {
				check = true;
			}
		} );
		return check;
	};

	this.removeCustomCheckoutValue = ( num: number, index: number ) => {
		if ( this.activeTab === 2 ) {
			this.customer[ 'f' + num + '_value' ].splice( index, 1 );
		} else if ( this.activeTab === 1 ) {
			this.customer[ 'f' + num + '_value' ].splice( index, 1 );
		}
	};

	this.sanitizeCustomer = ( customer: any ): Customer => {
		let hasMistypedValues = false;
		const sanitizedCustomer = customer;
		for ( let index = 1; index <= 6; index++ ) {
			const key = `f${ index }_value`;
			if ( typeof sanitizedCustomer[ key ] === 'string' || typeof sanitizedCustomer[ key ] === 'number' ) {
				sanitizedCustomer[ key ] = [ sanitizedCustomer[ key ] ];
				console.warn( `The '${ key }' property for ${ customer.name } ID #${ customer.id } has a mistyped value.` );
				hasMistypedValues = true;
			}
		}

		if ( hasMistypedValues ) {
			Localized.setNotification( {
				type: 'warning',
				message: 'One or more of the Custom Checkout Fields had a mistyped value that has been corrected. To review the changes, select the Checkout tab and click the Customize Checkout Fields button. To save the fixed changes, please click the Update button below.',
			} );
		}
		return sanitizedCustomer;
	};

	/**
	 * Callback that is used by the search modal
	 */
	this.searchCancelled = () => {
		angular.noop();
	};

	this.searchCustomers = () => {
		this.isLoadingMore = true;
		const req = {
			method: 'GET',
			url: this.customerEndpoint,
			params: this.searchParams,
		};
		Utils.getHttpPromise( req, 2 )
			.then( ( resp: any ) => {
				this.customers = resp.customers;
				this.roles = resp.roles;
				this.priceSheets = resp.price_sheets;
			}, ( errResp: Error ) => {
				Debug.error( errResp );
			} ).finally( () => {
				this.isLoadingMore = false;
				this.isLoading = false;
			} );
	};

	/**
	 * Callback that is used by the search modal
	 *
	 * @param {Object} resp Response
	 */
	this.searchResults = ( resp: any ) => {
		if ( this.activeTab === 2 ) {
			this.customer.group = resp[ 0 ].value;
			this.customer.group_id = resp[ 0 ].value.group_id;
		} else if ( this.activeTab === 1 ) {
			this.customer.group = resp[ 0 ].value;
			this.customer.group_id = resp[ 0 ].value.group_id;
		}
	};

	this.setPage = ( page: number ) => {
		this.searchParams.page = page;
		this.searchCustomers();
	};

	this.setPerPage = ( perPage: number ) => {
		this.searchParams.perPage = perPage;
		this.searchCustomers();
	};

	this.setQuery = ( query: string, searchBy: string ) => {
		this.searchParams.page = 1; // Reset page when query changes.
		this.searchParams.q = query;
		this.searchParams.searchBy = searchBy;
		this.searchTerm = this.searchParams.q;
		this.searchedBy = this.searchParams.searchBy;
		this.searchCustomers();
	};

	/**
	 * @param {string} key Expecting 'shipping' or 'billing.
	 * @param {Object} e   Click event
	 */

	this.editAddresses = ( key: 'shipping' | 'billing', e: Event ) => {
		e.preventDefault();
		const customerId = this.customer.id;
		const modal = $uibModal.open( {
			component: 'customerAddressModal',
			resolve: {
				customerId() {
					return customerId;
				},
				key() {
					return key;
				},
			},
			size: 'lg',
		} );
		modal.result
			.then( () => {
				angular.noop();
			} );
	};

	/**
	 * @param {string} orderBy Sortby term
	 * @param {Object} e       Click event
	 */
	this.changeOrderBy = ( orderBy: string, e: Event ) => {
		e.preventDefault();
		this.sortAscending = ( this.searchParams.orderBy === orderBy ) ? ! this.sortAscending : true;
		this.searchParams.orderBy = orderBy;
		this.searchParams.direction = this.sortAscending ? 'asc' : 'desc';
		this.searchCustomers();
	};

	this.updateCustomer = () => {
		this.isLoading = true;
		const endpoint = `${ this.customerEndpoint }${ this.customer.id }`;
		const data = this.customer;

		/* Delete properties that have a structural mismatch between GET and PUT requests (e.g. shipping_flat_rates). */
		delete data.shipping_flat_rates;

		// Remove password property from data unless user is explicitly changing the password.
		if ( ! this.isSettingNewPassword && 'password' in data ) {
			delete data.password;
		}

		Utils.httpPut( endpoint, null, data, 2 )
			.then( ( resp: any ) => {
				if ( resp.errors.length <= 0 ) {
					this.customer = resp.customer;
				}
			} )
			.catch( ( errResp: Error ) => {
				Debug.error( errResp );
			} )
			.finally( (): void => {
				this.cancelPasswordChange();
				this.isLoading = false;
			} );
	};

	this.updatePriceSheet = ( priceSheetId: number, isNew: boolean ) => {
		this.customer.price_sheet_id = priceSheetId;
	};

	this.viewDocument = ( id: number ) => {
		window.open( Admin.Download( localized.apiURL + '/admin/customers/' + this.customer.id + '/documents/' + id ), '_blank' );
	};

	/**
	 */
	this.removeGroup = () => {
		this.customer.group = null;
		this.customer.group_id = null;
	};

	/**
	 * Handles toggling approver/requestors values that won't mix
	 *
	 * @param {Object}  customer    Customer data
	 * @param {boolean} isRequestor Is the user a requestor
	 */
	this.updateGroupPermissions = ( customer: Customer, isRequestor: boolean ) => {
		if ( customer.group ) {
			if ( isRequestor ) {
				if ( customer.group.requestor ) {
					customer.group.approver = false;
					customer.group.pending_emails = false;
					customer.group.admin = false;
				}
			} else if ( customer.group.approver || customer.group.admin || customer.group.pending_emails ) {
				customer.group.requestor = false;

				if ( customer.group.pending_emails && ! customer.group.approver ) {
					customer.group.pending_emails = false;
				}
			}
		}
	};

	this.OpenSupplierSearch = ( model: any ) => {
		this.searchModalPage = 'supplier';
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
				model.punchout_suppliers.push( {
					supplier: {
						name: resp[ 0 ].value.name,
						id: resp[ 0 ].value.id,
					},
				},
				);
			},
			cancel: () => {
				angular.noop();
			},
		};
		SearchModal.Show( callback, 'Suppliers', data, 'Add Supplier' );
	};

	this.removeProfile = ( index: number, customer: any ) => {
		customer.punchout_suppliers[ index ].deleted = true;
	};
}

