import template from './bs-table-sortable.html';

export const BsTableSortableComponent = {
	bindings: {
		field: '@',
		label: '@',
		onClick: '&',
		params: '<',
	},
	controller: class BsTableSortableController {
		field: string;
		label: string;
		onClick: ({
			orderBy,
			direction,
		}: {
			orderBy: string;
			direction: string;
		}) => void;
		isAscending: boolean;
		params: {
			orderBy: string;
			direction: string;
		};

		$onInit() {
			this.isAscending =
				this.params.orderBy !== this.field ||
				this.params.direction !== 'desc';
		}

		click(e: Event) {
			e.preventDefault();
			const { field: orderBy } = this;
			if (this.params.orderBy === this.field) {
				this.isAscending = !this.isAscending;
			}
			const direction = this.isAscending ? 'asc' : 'desc';
			this.onClick({ orderBy, direction });
		}
	},
	template,
};
