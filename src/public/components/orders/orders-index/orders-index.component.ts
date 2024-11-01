interface PaginatedData {
	from: number;
	to: number;
	total: number;
}

interface Status {
	label: string;
	status: string | null;
}

import template from './orders-index.component.html';

export const OrdersIndexComponent: ng.IComponentOptions = {
	template,
	controller: class OrdersIndexController {
		static $inject: string[] = ['$location', '$rootScope', 'User', 'Utils'];

		currentPage: number;
		filter: {
			term: string;
			field: string;
		} = {
			term: '',
			field: '',
		};
		filterOptions: {
			label: string;
			field?: string;
			type?: string;
			options?: {
				label: string;
				field: string;
				type: string;
			}[];
		}[] = [
			{
				label: 'Shipping',
				options: [
					{
						label: 'First Name',
						field: 'first_name',
						type: 'string',
					},
					{
						label: 'Last Name',
						field: 'last_name',
						type: 'string',
					},
					{
						label: 'Street Address',
						field: 'address1',
						type: 'string',
					},
					{
						label: 'Apt., Suite, etc.',
						field: 'address2',
						type: 'string',
					},
					{
						label: 'City',
						field: 'city',
						type: 'string',
					},
					{
						label: 'State',
						field: 'state',
						type: 'string',
					},
					{
						label: 'Zip Code',
						field: 'zip',
						type: 'string',
					},
					{
						label: 'Email',
						field: 'email',
						type: 'string',
					},
					{
						label: 'Phone',
						field: 'phone',
						type: 'string',
					},
				],
			},
			{
				label: 'Billing',
				options: [
					{
						label: 'Billing First Name',
						field: 'bill_first_name',
						type: 'string',
					},
					{
						label: 'Billing Last Name',
						field: 'bill_last_name',
						type: 'string',
					},
					{
						label: 'Billing Address',
						field: 'bill_address1',
						type: 'string',
					},
					{
						label: 'Billing Apt., Suite, etc.',
						field: 'bill_address2',
						type: 'string',
					},
					{
						label: 'Billing City',
						field: 'bill_city',
						type: 'string',
					},
					{
						label: 'Billing State',
						field: 'bill_state',
						type: 'string',
					},
					{
						label: 'Billing Zip Code',
						field: 'bill_zip',
						type: 'string',
					},
					{
						label: 'Billing Email',
						field: 'bill_email',
						type: 'string',
					},
					{
						label: 'Billing Phone',
						field: 'bill_phone',
						type: 'string',
					},
				],
			},
			{
				label: 'Additional Checkout Fields',
				options: [
					{
						label: 'Company/Organization',
						field: 'organization',
						type: 'string',
					},
					{
						label: 'Purchase Order Number',
						field: 'rr_po_num',
						type: 'string',
					},
					{
						label: 'Issuing Office',
						field: 'issuing_office',
						type: 'string',
					},
					{
						label: 'Cost Center Code',
						field: 'cost_center_code',
						type: 'string',
					},
					{
						label: 'Attention',
						field: 'attention',
						type: 'string',
					},
				],
			},
			{
				label: 'Approver',
				field: 'approver',
				type: 'string',
			},
			{
				label: 'Order Prefix',
				field: 'order_prefix',
				type: 'string',
			},
			{
				label: 'Promo Codes applied',
				field: 'promo_codes',
				type: 'string',
			},
			{
				label: 'Shipping Carrier',
				field: 'shipping_carrier',
				type: 'string',
			},
			{
				label: 'Status',
				field: 'status',
				type: 'string',
			},
			{
				label: 'Tracking Code',
				field: 'tracking_code',
				type: 'string',
			},
		];
		isLoading: boolean;
		isShowingFilters: boolean;
		isSignedIn: boolean;
		orderId?: number;
		orders: PaginatedData;
		pages: number[];
		pageLimit = 3;
		pageUrls: {
			login: string;
			register: string;
		};
		params: {
			filters?: {
				field: string;
				term: string;
			}[];
			page?: number;
			q?: string;
			searchBy?: string;
			orderBy?: string;
			direction?: 'asc' | 'desc';
			status?: string | null;
		};
		q = '';
		statuses: Status[];
		status: Status;

		// eslint-disable-next-line no-useless-constructor
		constructor(
			private $location: ng.ILocationService,
			private $rootScope: ng.IRootScopeService,
			private User: any,
			private Utils: any
		) {}

		$onInit() {
			this.isSignedIn = this.User.isAuthed && this.User.email;
			this.pageUrls = {
				login: this.Utils.getPageUrl('login', {
					redirect_to: this.$location.path(),
				}),
				register: this.Utils.getPageUrl('register'),
			};
			this.params = {
				orderBy: 'order_date',
				direction: 'desc',
			};
			this.orderId = this.$location.search().id;
			this.statuses = [
				{ label: 'All', status: '' },
				{ label: 'Completed', status: 'completed' },
				{ label: 'Pending Approval', status: 'pending-approval' },
				{ label: 'Cancelled', status: 'cancelled' },
			];
			this.status = this.statuses[0];
			this.listenForLocationChange();

			if (this.isSignedIn && !this.orderId) {
				this.getOrders();
			}
		}

		changePage(e: Event, page: number): void {
			e.preventDefault();
			this.params.page = page;
			this.getOrders();
		}

		changeQuery(newQuery: string): void {
			this.params.q = newQuery;
			if (
				this.filter.field &&
				this.filter.term &&
				this.isShowingFilters
			) {
				this.params.filters = [
					{
						field: this.filter.field,
						term: this.filter.term,
					},
				];
			} else if ('filters' in this.params) {
				delete this.params.filters;
			}

			this.params.page = 1;
			this.getOrders();
		}

		changeSortBy(e: Event, newSortBy: string): void {
			e.preventDefault();
			if (this.params.orderBy === newSortBy) {
				this.params.direction =
					this.params.direction === 'desc' ? 'asc' : 'desc';
			}
			this.params.orderBy = newSortBy;
			this.getOrders();
		}

		changeStatus(newStatus: string | null) {
			this.params.status = newStatus;
			this.getOrders();
		}

		getOrders(): void {
			this.isLoading = true;
			this.User.listOrders(this.params)
				.then((response) => response.data)
				.then((data) => {
					this.orders = data.orders;
					this.pages = this.getPagination(data.orders.last_page);
					this.currentPage = data.orders.current_page;
					this.isLoading = false;
				});
		}

		goToDetail(e: Event, id: number): void {
			e.preventDefault();
			this.orderId = id;
			this.$location.search('id', id);
		}

		listenForLocationChange(): void {
			this.$rootScope.$on('$locationChangeStart', () => {
				this.orderId = this.$location.search().id;
				if (this.isSignedIn && !this.orderId) {
					this.getOrders();
				}
			});
		}

		getPagination(lastPage: number): number[] {
			const pages = new Array(lastPage);
			for (let i = 0; i < lastPage; i++) {
				pages[i] = i + 1;
			}
			return pages;
		}

		showEllipse(
			page: number,
			currentPage: number,
			totalPages: number
		): boolean {
			if (page === 1 && currentPage > this.pageLimit + 1) {
				return true;
			} else if (
				page === totalPages - 1 &&
				currentPage < totalPages - this.pageLimit
			) {
				return true;
			}
		}

		showPage(
			page: number,
			currentPage: number,
			totalPages: number
		): boolean {
			if (page !== currentPage) {
				if (page === 1 || page === totalPages) {
					return true;
				} else if (
					page < currentPage + this.pageLimit &&
					page > currentPage - this.pageLimit
				) {
					return true;
				}
			}
		}
	},
};
