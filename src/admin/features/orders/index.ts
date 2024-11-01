import template from './index.template.html';

interface FilterField {
	label: string;
	field: string;
	term?: string;
}

enum Status {
	Created = 'created',
	'Pending Approval' = 'pending-approval',
	Completed = 'completed',
	Canceled = 'canceled',
}

export const OrdersIndexComponent: ng.IComponentOptions = {
	template,
	controller: class OrdersIndexController {
		static $inject = ['$state', 'OrdersService'];

		isLoading = true;
		filterFields = [
			{
				label: 'Order Prefix',
				field: 'order_prefix',
			},
			{
				label: 'Status',
				field: 'status',
				options: Status,
				term: Status.Completed,
			},
		];
		params: {
			page: number;
			q?: string;
			filters?: any;
			orderBy?: string;
			direction?: string;
			rpp?: number;
		} = {
			page: 1,
			orderBy: 'order_id',
			direction: 'desc',
		};
		rppValues = [15, 30, 50, 100];
		searchParams = {
			q: '',
			orderBy: '',
			direction: '',
			rpp: this.rppValues[0],
		};
		orders: any;
		nav = [
			{
				label: 'Order tracking',
				href: `?page=vendorfuel#!/orders/tracking`,
			},
		];

		// eslint-disable-next-line no-useless-constructor
		constructor(
			private $state: ng.ui.IStateService,
			private OrdersService: { query: any }
		) {}

		$onInit() {
			// Set initial status filter to Completed
			this.params.filters = [
				{
					field: 'status',
					term: Status.Completed,
				},
			];

			this.queryOrders();
		}

		changeQuery(q: string, filterFields: FilterField[]) {
			// Update q or delete from params
			if (q) {
				this.params.q = q;
			} else {
				delete this.params.q;
			}

			// Update filters or delete from params
			const activeFilters = filterFields.filter((filter) => filter.term);
			if (activeFilters.length) {
				this.params.filters = activeFilters.map((filter) => {
					return {
						field: filter.field,
						term: filter.term,
					};
				});
			} else if ('filters' in this.params) {
				delete this.params.filters;
			}

			// Reset page to 1 whenever query changes.
			this.params.page = 1;
			this.queryOrders();
		}

		queryOrders() {
			this.isLoading = true;
			const params = this.params;

			this.OrdersService.query(params)
				.then((response: ng.IHttpResponse<any>) => response.data)
				.then((data: any) => {
					this.orders = data.orders;
					this.isLoading = false;
				});
		}

		clickOrder(id: number) {
			this.$state.go('orders.show', { id });
		}

		changeSort(orderBy: string, direction: string) {
			this.params.orderBy = orderBy;
			this.params.direction = direction;
			this.queryOrders();
		}

		changePage(page: number, rpp: number) {
			this.params.page = page;
			this.params.rpp = rpp;
			this.queryOrders();
		}
	},
};
