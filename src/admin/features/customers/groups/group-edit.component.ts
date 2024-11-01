import Papa from 'papaparse';
import template from './group-edit.component.html';
import type { Localized } from '../../../types';

declare const localized: Localized;
declare const angular: ng.IAngularStatic;

export const GroupEdit: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$scope',
	'$state',
	'$stateParams',
	'Admin',
	'Settings',
	'Debug',
	'Utils',
	'SearchModal',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Settings: any,
	Debug: any,
	Utils: any,
	SearchModal: any
) {
	this.page = 1;
	this.perPage = 15;
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	this.$onInit = () => {
		this.breadcrumbs = [
			{ label: 'Customers', href: '?page=vf-admin#/customers' },
			{ label: 'Groups', href: '?page=vendorfuel#!/groups/accounts' },
		];

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
		$scope.rppValues = [15, 30, 50, 100];
		$scope.searchTerm = '';
		$scope.shippingModes = {
			default: 'Default',
			free: 'Free',
			method: 'Flat Rate',
			parcel: 'Parcel',
		};
		$scope.updatedRates = [];

		this.groupEndpoint = localized.apiURL + '/admin/groups/';
		this.searchOptions = {
			group_id: 'ID',
			name: 'Name',
			parent_group_id: 'Parent ID',
			default_price_sheet: 'Default Price Sheet',
		};
		this.searchParams = {
			page: 1,
			q: '',
			searchBy: '',
			sortBy: '',
			sortType: '',
			rpp: $scope.rppValues[0], // Must be defined after rppValues is declared.
		};
		this.sortAscending = true;

		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		const req: any = {
			method: 'GET',
			url: this.groupEndpoint,
		};
		$scope.Show(1);
		this.getPricesheets();
	};

	this.getPricesheets = () => {
		const url = `${nextApiURL}/admin/pricesheets`;
		$http.get(url).then((response) => {
			if (
				!response.data.errors.length &&
				response.data?.pricesheets?.data
			) {
				this.pricesheets = response.data.pricesheets.data;
			}
		});
	};

	this.handleUpdate = () => {
		this.showGroup();
	};

	this.handleChangePage = (page: number) => {
		this.page = page;
		this.showGroup();
	};

	this.showGroup = () => {
		const url = `${nextApiURL}/admin/groups/${$stateParams.id}`;
		const config = {
			params: {
				page: this.page,
				perPage: this.perPage,
			},
		};
		$http.get(url, config).then((response) => {
			if (!response.data.errors.length) {
				this.selectedGroup = response.data.group;
			}
		});
	};

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};
	$scope.GroupSearchResults = (resp: any) => {
		//callback that is used by the search modal
		this.selectedGroup.parent_group = resp[0].value;
		this.selectedGroup.parent_group_id = resp[0].value.group_id;
	};
	$scope.CustomerSearchResults = (resp: any) => {
		const currentIds = this.selectedGroup.customers.data.map(
			(c: any) => c.customer_id
		);
		for (let i = 0; i < resp.length; i++) {
			if (
				currentIds.includes(resp[i].value.customer_id) &&
				resp[i].action === 'remove'
			) {
				for (
					let j = 0;
					j < this.selectedGroup.customers.data.length;
					j++
				) {
					if (
						this.selectedGroup.customers.data[j].customer_id ===
						resp[i].value.customer_id
					) {
						this.selectedGroup.customers.data.splice(j, 1);
						break;
					}
				}
			}
			if (!currentIds.includes(resp[i].value.customer_id)) {
				this.selectedGroup.customers.data.push(resp[i].value);
			}
		}
	};
	$scope.SearchCancelled = () => {
		//callback that is used by the search modal
	};

	$scope.Show = (page: number) => {
		const params = {
			page,
			perPage: this.perPage,
		};
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		const req = {
			method: 'GET',
			url: this.groupEndpoint,
			params,
		};
		req.url += $stateParams.id;
		Utils.getHttpPromise(req)
			.then(
				(response: any) => {
					this.selectedGroup = response.group;
					this.selectedGroup.shipping_flat_rates = [];
					this.breadcrumbs.push({
						label: response.group.name,
						href: `?page=vendorfuel#!/customers/groups/${response.group.group_id}`,
					});
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	$scope.SelectChild = (groupId: number) => {
		$scope.loading = true;
		const req = {
			method: 'GET',
			url: this.groupEndpoint,
		};
		req.url += groupId;
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					this.selectedGroup = resp.group;
					$scope.priceSheets = resp.price_sheets;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	this.changeSortBy = (sortBy: string, e: Event) => {
		e.preventDefault();
		this.sortAscending =
			this.searchParams.sortBy === sortBy ? !this.sortAscending : true;
		this.searchParams.sortBy = sortBy;
		this.searchParams.sortType = this.sortAscending ? 'asc' : 'desc';
		this.searchGroups();
	};

	this.searchGroups = () => {
		$scope.loadingMore = true;
		const req = {
			method: 'GET',
			url: this.groupEndpoint,
			params: this.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.customerGroups = resp.groups;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loadingMore = false;
			});
	};

	this.setPage = (page: number) => {
		this.searchParams.page = page;
		this.searchGroups();
	};

	this.setRpp = (rpp: number) => {
		this.searchParams.rpp = rpp;
		this.searchGroups();
	};

	this.setQuery = (query: string, searchBy: string) => {
		this.searchParams.page = 1; // Reset page when query changes.
		this.searchParams.q = query;
		this.searchParams.searchBy = searchBy;
		this.searchTerm = this.searchParams.q;
		this.searchedBy = this.searchParams.searchBy;
		this.searchGroups();
	};

	$scope.OpenCustomerSearchModal = () => {
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
					relationships: ['customers', 'group'],
					fields: ['customer_id', 'name', 'email', '.name'],
					fieldPrefixes: ['ID: ', '', '', 'Group: '],
					id: 'customer_id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url: this.groupEndpoint + this.selectedGroup.group_id,
						params: {
							q: '',
						},
					},
					relationships: ['group', 'customers'],
					fields: ['customer_id', 'name', 'email', 'status'],
					fieldPrefixes: ['ID: ', '', '', 'Status: '],
					id: 'customer_id',
				},
			],
		};
		callback = {
			confirm: $scope.CustomerSearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(callback, 'Select Customers', data, 'Add items');
	};
	$scope.OpenGroupSearchModal = () => {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: this.groupEndpoint,
						params: {
							q: '',
						},
					},
					relationships: ['groups'],
					fields: [
						'group_id',
						'parent_group_id',
						'name',
						'default_price_sheet',
					],
					fieldPrefixes: ['ID: ', 'Parent ID: ', '', 'Price Sheet: '],
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
		SearchModal.Show(
			callback,
			$scope.newGroup.name || 'New Group',
			data,
			'Add items'
		);
	};
	$scope.OpenRatesSearchModal = () => {
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
							excludedId: this.selectedGroup.group_id,
							excludedTable: 'shipping_flat_rate_group',
						},
					},
					relationships: ['shipping_flat_rates'],
					fields: ['id', 'name', 'cost', 'enabled'],
					fieldPrefixes: ['', 'Name: ', 'Cost: ', 'Enabled: '],
					id: 'id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url: this.groupEndpoint + this.selectedGroup.group_id,
					},
					relationships: ['group'],
					fields: ['name', 'cost', 'enabled'],
					fieldPrefixes: ['Name: ', 'Cost: ', 'Enabled: '],
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
		SearchModal.Show(callback, 'Flat Rates', data, 'Add Shipping Rates');
	};
	$scope.rateResults = (resp: any) => {
		$scope.updatedRates = [];
		resp.forEach((rate: any) => {
			if (rate.action === 'add') {
				$scope.updatedRates.push(rate);
				this.selectedGroup.shipping_flat_rates.push({
					id: rate.value.id,
				});
			}
			if (rate.action === 'unselect') {
				angular.forEach(
					this.selectedGroup.shipping_flat_rates,
					(val, key) => {
						if (val.id === rate.value.id) {
							this.selectedGroup.shipping_flat_rates.splice(
								key,
								1
							);
						}
					}
				);
			}
			if (rate.action === 'remove') {
				$scope.updatedRates.push(rate);
				this.selectedGroup.shipping_flat_rates.push({
					id: rate.value.id,
					deleted: 1,
				});
			}
			if (rate.action === 'deselect') {
				angular.forEach(
					this.selectedGroup.shipping_flat_rates,
					(val, key) => {
						if (val.id === rate.value.id) {
							this.selectedGroup.shipping_flat_rates.splice(
								key,
								1
							);
						}
					}
				);
			}
		});
	};
	$scope.rateCheck = (rate: any) => {
		let check = false;
		angular.forEach($scope.updatedRates, (key) => {
			if (key.value.id === rate.id && key.action === 'remove') {
				check = true;
			}
		});
		return check;
	};
	$scope.UpdateGroup = () => {
		$scope.loading = true;
		const req = {
			method: 'PUT',
			url: this.groupEndpoint + this.selectedGroup.group_id,
			data: this.selectedGroup,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					if (resp.errors.length <= 0) {
						angular.forEach($scope.updatedRates, (rate) => {
							if (rate.action === 'add') {
								this.selectedGroup.flatrates.push(rate.value);
							} else {
								angular.forEach(
									this.selectedGroup.flatrates,
									(val, key) => {
										if (val.id === rate.value.id) {
											this.selectedGroup.flatrates.splice(
												key,
												1
											);
										}
									}
								);
							}
						});
						$scope.updatedRates = [];
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	/**
	 * Delete a group
	 */
	this.deleteGroup = () => {
		this.isDeleting = true;
		const endpoint = this.groupEndpoint + this.selectedGroup.group_id;

		Utils.httpDelete(endpoint)
			.then(() => {
				this.selectedGroup = null;
				$state.go('customers.groups.index');
			})
			.catch((error: Error) => {
				Debug.error(error);
			})
			.finally(() => {
				this.isDeleting = false;
			});
	};

	/**
	 * Punchout Profiles
	 */
	$scope.OpenSupplierSearch = () => {
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
				$scope.selectedGroup.punchout_profiles.push({
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

	$scope.RemoveProfile = (index: number) => {
		$scope.selectedGroup.punchout_profiles[index].deleted = true;
	};
}
