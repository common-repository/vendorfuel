import angular from 'angular';
import template from './group-create.component.html';
import type { Localized } from '../types';

declare const localized: Localized;

export const GroupCreate: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$scope',
	'$state',
	'Admin',
	'Debug',
	'Utils',
	'SearchModal',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	Admin: any,
	Debug: any,
	Utils: any,
	SearchModal: any
) {
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	this.$onInit = () => {
		this.breadcrumbs = [
			{ label: 'Customers', href: '?page=vf-admin#/customers' },
			{ label: 'Groups', href: '?page=vf-admin#/customers/groups' },
			{
				label: 'Add new',
				href: '?page=vendorfuel#!/customers/groups/create',
			},
		];

		$scope.isAuthed = Admin.Authed();
		$scope.loading = false;
		$scope.loadingMore = false;
		this.group = {
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

		this.groupEndpoint = `${nextApiURL}/admin/customers/groups/`;
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
		if (!this.group.default_price_sheet) {
			Utils.getHttpPromise(req)
				.then(
					(resp: any) => {
						$scope.priceSheets = resp.price_sheets;
						this.group.default_price_sheet =
							resp.default_price_sheet;
					},
					(errResp: Error) => {
						Debug.error(errResp);
					}
				)
				.finally(() => {
					$scope.loading = false;
				});
		} else {
			$scope.loading = false;
		}

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

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};
	$scope.GroupSearchResults = (resp: any) => {
		this.group.parent_group = resp[0].value;
		this.group.parent_group_id = resp[0].value.group_id;
	};
	$scope.CustomerSearchResults = (resp: any) => {
		if (this.group.customers.data && this.group.customers.data.length) {
			const customerIds = this.group.customers.data.map(
				(c: any) => c.customer_id
			);
			for (let k = 0; k < resp.length; k++) {
				if (!customerIds.includes(resp[k].value.customer_id)) {
					this.group.customers.data.push(resp[k].value);
				}
			}
		} else {
			for (let l = 0; l < resp.length; l++) {
				this.group.customers.data.push(resp[l].value);
			}
		}
	};
	$scope.SearchCancelled = () => {
		//callback that is used by the search modal
	};

	$scope.Show = (page: number) => {
		const params = {
			page,
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
		req.url += this.selectedGroup.group_id;
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					this.selectedGroup = resp.group;
					this.selectedGroup.shipping_flat_rates = [];
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
			this.group.name || 'New Group',
			data,
			'Add items'
		);
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
	$scope.AddGroup = () => {
		$scope.loading = true;
		const req = {
			method: 'POST',
			url: this.groupEndpoint,
			data: this.group,
		};
		Utils.getHttpPromise(req)
			.then(
				(response: any) => {
					if (!response.errors.length) {
						$state.go('customers.groups.edit', {
							id: response.group.group_id,
						});
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

	this.removeParent = (): void => {
		this.group.parent_group_id = null;
		this.group.parent_group = null;
	};
}
