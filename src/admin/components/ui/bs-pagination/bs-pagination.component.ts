import template from './bs-pagination.html';

export const BsPaginationComponent = {
	bindings: {
		data: '<',
		isLoading: '<',
		onChange: '&',
	},
	controller: class BsPaginationController {
		data: {
			per_page: number | string;
		};
		onChange: ({ page, rpp }: { page: number; rpp: number }) => void;
		rppValues = [15, 30, 50, 100];
		rpp: number;

		$onChanges(): void {
			if (this.data?.per_page) {
				this.rpp = Number(this.data.per_page);
			}
		}

		changePage(page: number, e: Event) {
			e.preventDefault();
			const { rpp } = this;
			this.onChange({ page, rpp });
		}

		changeRpp() {
			const page = 1;
			const { rpp } = this;
			this.onChange({ page, rpp });
		}
	},
	template,
};
