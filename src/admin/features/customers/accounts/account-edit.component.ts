import angular from 'angular';
import { toast } from 'react-toastify';
import template from './account-edit.component.html';
import { Customer } from '../../../customers/Customer';
import type { PriceSheet } from '../../../catalog/pricesheets/PriceSheet';

export const AccountEdit: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$state',
	'$stateParams',
	'Admin',
	'Debug',
	'Utils',
	'SearchModal',
	'customerAccountsService',
	'$uibModal',
];

function controller(
	$http: ng.IHttpService,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Debug: any,
	Utils: any,
	SearchModal: any,
	customerAccountsService: any,
	$uibModal: ng.ui.bootstrap.IModalService
) {
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	this.$onInit = () => {
		this.breadcrumbs = [
			{ label: 'Customers', href: '?page=vf-customers' },
			{
				label: 'Accounts',
				href: '?page=vf-customers#/accounts',
			},
		];

		if (Number.isInteger(parseInt($stateParams.id))) {
			this.id = parseInt($stateParams.id);
			this.getCustomer(this.id);
		} else {
			this.isNew = true;
			this.customer = new Customer();
			this.breadcrumbs.push({
				label: 'Add new',
				href: `?page=vendorfuel#!/customers/accounts/create`,
			});
			this.getPriceSheets();
		}

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
		this.isCostCenterRequired =
			localized.settings.general.checkout.cost_center_option_required;
		this.passwordPattern =
			/(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*]{8,}/;
		this.replaceFields = {
			organization: 'Company/Organization',
			rr_po_num: 'Purchase Order Number',
			issuing_office: 'Issuing Office',
			cost_center_code: 'Cost Center Code',
			attention: 'Attention',
		};
		this.role = null;
		this.perPageValues = [15, 30, 50, 100];
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
			perPage: this.perPageValues[0], // Must be defined after perPageValues is declared.
		};
		this.searchTerm = '';
		this.sortAscending = true;
		this.states = this.customerData.states;
		this.statuses = {
			active: 'Active',
			inactive: 'Inactive',
			unverified: 'Unverified',
		};
		this.updatedRates = [];
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
	this.changeCustomer = (key: string, value: unknown) => {
		this.customer[key] = value;
	};

	this.getCustomer = (id: number) => {
		this.isLoading = true;
		const url = `${nextApiURL}/admin/customers/${id}`;
		$http
			.get(url)
			.then((response) => {
				this.price_sheets = response.data.price_sheets;
				this.customer = response.data.customer;
				this.suppliers = response.data.suppliers;

				this.breadcrumbs.push({
					label: this.customer.name,
					href: `?page=vendorfuel#!/customers/accounts/${this.id}`,
				});
			})
			.catch((error) => {
				Debug.error(error);
			})
			.finally(() => {
				this.isLoading = false;
			});
	};

	/**
	 * @param {number} num Number
	 */
	this.addCustomCheckoutValue = (num: number) => {
		if (this.customer['f' + num + '_value']) {
			this.customer['f' + num + '_value'].push('');
		} else {
			this.customer['f' + num + '_value'] = [];
			this.customer['f' + num + '_value'].push('');
		}
	};

	this.addCustomer = () => {
		this.isLoading = true;
		const req = {
			method: 'POST',
			url: this.customerEndpoint,
			data: this.customer,
		};
		Utils.getHttpPromise(req, 2)
			.then(
				(resp: any) => {
					if (resp.errors.length <= 0) {
						this.customer = resp.customer;
						$state.go('catalog.products.edit', {
							id: this.customer.id,
						});
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.isLoading = false;
			});
	};

	this.checkPriceSheet = (tabIndex: number) => {
		if (tabIndex === 1) {
			angular.forEach(this.price_sheets, (sheet) => {
				if (this.customer.price_sheet_id === sheet.price_sheet_id) {
					this.selectedSheet = sheet.sheet;
				}
			});
		}
		if (tabIndex === 2) {
			angular.forEach(this.price_sheets, (sheet) => {
				if (this.customer.price_sheet_id === sheet.price_sheet_id) {
					this.selectedSheet = sheet.sheet;
				}
			});
		}
	};

	this.formatDate = (date: string) => {
		const dateOut = new Date(date);
		return dateOut;
	};

	this.getPriceSheets = () => {
		const url = `${nextApiURL}/admin/pricesheets`;
		$http
			.get(url)
			.then((response) => {
				this.price_sheets = response.data.pricesheets.data;
			})
			.catch((error) => {
				Debug.error(error);
			});
	};

	this.goToProduct = (product: any) => {
		$state.go('catalog.products.index', { activeTab: 2, product });
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
						url: `${nextApiURL}/admin/customers/groups`,
						params: {
							q: '',
						},
					},
					relationships: ['groups'],
					fields: [
						'group_id',
						'name',
						'parent_group_id',
						'default_price_sheet',
					],
					fieldPrefixes: ['ID: ', '', 'Parent ID: ', 'Price Sheet: '],
					id: 'group_id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: this.searchResults,
			cancel: this.searchCancelled,
		};
		SearchModal.Show(callback, this.customer.name, data, 'Add items');
	};

	this.onCopy = (copiedCustomer: any) => {
		this.customer = copiedCustomer;
	};

	this.rateCheck = (rate: any) => {
		let check = false;
		angular.forEach(this.updatedRates, (key) => {
			if (key.value.id === rate.id && key.action === 'remove') {
				check = true;
			}
		});
		return check;
	};

	this.removeCustomCheckoutValue = (num: number, index: number) => {
		this.customer['f' + num + '_value'].splice(index, 1);
	};

	this.sanitizeCustomer = (customer: any): Customer => {
		let hasMistypedValues = false;
		const sanitizedCustomer = customer;
		for (let index = 1; index <= 6; index++) {
			const key = `f${index}_value`;
			if (
				typeof sanitizedCustomer[key] === 'string' ||
				typeof sanitizedCustomer[key] === 'number'
			) {
				sanitizedCustomer[key] = [sanitizedCustomer[key]];
				console.warn(
					`The '${key}' property for ${customer.name} ID #${customer.id} has a mistyped value.`
				);
				hasMistypedValues = true;
			}
		}

		if (hasMistypedValues) {
			toast.warning(
				'One or more of the Custom Checkout Fields had a mistyped value that has been corrected. To review the changes, select the Checkout tab and click the Customize Checkout Fields button. To save the fixed changes, please click the Update button below.',
				{ autoClose: false }
			);
		}
		return sanitizedCustomer;
	};

	this.hasDuplicateOptions = (values: unknown[]): boolean => {
		if (!values || values?.length === 1) {
			return false;
		}

		const set = new Set(
			values.map((value) => {
				return value === null ? '' : value;
			})
		);

		return values.length > set.size;
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
		Utils.getHttpPromise(req, 2)
			.then(
				(resp: any) => {
					this.customers = resp.customers;
					this.price_sheets = resp.price_sheets;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.isLoadingMore = false;
				this.isLoading = false;
			});
	};

	/**
	 * Callback that is used by the search modal
	 *
	 * @param {Object} resp Response
	 */
	this.searchResults = (resp: any) => {
		this.customer.group = resp[0].value;
		this.customer.group_id = resp[0].value.group_id;
	};

	this.setPage = (page: number) => {
		this.searchParams.page = page;
		this.searchCustomers();
	};

	this.setPerPage = (perPage: number) => {
		this.searchParams.perPage = perPage;
		this.searchCustomers();
	};

	this.setPriceSheet = (e: Event, priceSheet: PriceSheet) => {
		e.preventDefault();
		this.customer.pricesheet = priceSheet;
		this.customer.price_sheet_id = priceSheet.price_sheet_id;
	};

	this.setQuery = (query: string, searchBy: string) => {
		this.searchParams.page = 1; // Reset page when query changes.
		this.searchParams.q = query;
		this.searchParams.searchBy = searchBy;
		this.searchTerm = this.searchParams.q;
		this.searchedBy = this.searchParams.searchBy;
		this.searchCustomers();
	};

	this.storeCustomer = () => {
		this.isLoading = true;
		const url = `${nextApiURL}/admin/customers`;
		const data = this.customer;
		$http
			.post(url, data)
			.then((response) => {
				$state.go('customers.accounts.edit', {
					id: response.data.customer.id,
				});
			})
			.catch((error) => {
				Debug.error(error);
			})
			.finally(() => {
				this.isLoading = false;
			});
	};

	this.editAddresses = (type: 'shipping' | 'billing', e: Event) => {
		e.preventDefault();
		const customerId = this.customer.id;
		const modal = $uibModal.open({
			component: 'customerAddressModal',
			resolve: {
				customerId() {
					return customerId;
				},
				type() {
					return type;
				},
			},
			size: 'lg',
		});
		modal.result.then(() => {
			angular.noop();
		});
	};

	/**
	 * @param {string} orderBy Sortby term
	 * @param {Object} e       Click event
	 */
	this.changeOrderBy = (orderBy: string, e: Event) => {
		e.preventDefault();
		this.sortAscending =
			this.searchParams.orderBy === orderBy ? !this.sortAscending : true;
		this.searchParams.orderBy = orderBy;
		this.searchParams.direction = this.sortAscending ? 'asc' : 'desc';
		this.searchCustomers();
	};

	this.update = () => {
		this.isLoading = true;
		const url = `${nextApiURL}/admin/customers/${this.customer.id}`;
		const data = this.customer;

		// Remove password property from data unless user is explicitly changing the password.
		if (!this.isSettingNewPassword && 'password' in data) {
			delete data.password;
		}

		$http
			.put(url, data)
			.then((response) => response.data)
			.then((responseData) => {
				if (responseData.errors.length <= 0) {
					this.customer = responseData.customer;
				}
			})
			.catch((error) => Debug.error(error))
			.finally((): void => {
				this.cancelPasswordChange();
				this.isLoading = false;
			});
	};

	this.updatePriceSheet = (priceSheetId: number, isNew: boolean) => {
		this.customer.price_sheet_id = priceSheetId;
	};

	this.viewDocument = (id: number) => {
		window.open(
			Admin.Download(
				localized.apiURL +
					'/admin/customers/' +
					this.customer.id +
					'/documents/' +
					id
			),
			'_blank'
		);
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
	this.updateGroupPermissions = (
		customer: Customer,
		isRequestor: boolean
	) => {
		if (customer.group) {
			if (isRequestor) {
				if (customer.group.requestor) {
					customer.group.approver = false;
					customer.group.pending_emails = false;
					customer.group.admin = false;
				}
			} else if (
				customer.group.approver ||
				customer.group.admin ||
				customer.group.pending_emails
			) {
				customer.group.requestor = false;

				if (customer.group.pending_emails && !customer.group.approver) {
					customer.group.pending_emails = false;
				}
			}
		}
	};

	this.OpenSupplierSearch = (model: any) => {
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
					relationships: ['suppliers'],
					fields: ['id', 'name'],
					fieldPrefixes: ['ID: ', ''],
					id: 'id',
					selectOne: false,
				},
			],
		};
		callback = {
			confirm(resp: any) {
				model.punchout_suppliers.push({
					supplier: {
						name: resp[0].value.name,
						id: resp[0].value.id,
					},
				});
			},
			cancel: () => {
				angular.noop();
			},
		};
		SearchModal.Show(callback, 'Suppliers', data, 'Add Supplier');
	};

	this.removeProfile = (index: number, customer: any) => {
		customer.punchout_suppliers[index].deleted = true;
	};
}
