import { Collapse } from 'bootstrap';
import template from './bs-search-box.html';

interface FilterField {
	label: string;
	field: string;
	options: Enumerator;
	term?: string;
}

export const BsSearchBoxComponent = {
	bindings: {
		filterFields: '<?',
		isLoading: '<?',
		isShowingFilters: '<?',
		onSubmit: '&',
		q: '<?',
	},
	controller: class BsSearchBoxController {
		filterFields: FilterField[];
		filtersCollapse: Collapse;
		public isShowingFilters: boolean;
		onSubmit: ({
			q,
			filterFields,
		}: {
			q: string;
			filterFields: FilterField[];
		}) => void;
		page = 1;
		q: string;

		$onInit() {
			this.isShowingFilters = this.isShowingFilters || false;
			const el = document.getElementById('search-box-filters');
			this.filtersCollapse = new Collapse(el, {
				toggle: this.isShowingFilters,
			});
		}

		changeInput(val: string) {
			// Detect if a search-type input field has been cleared, and if so, trigger the form submission.
			if (!val) {
				this.submit();
			}
		}

		submit() {
			const { q, filterFields } = this;
			this.onSubmit({ q, filterFields });
		}

		toggleShowFilters() {
			this.isShowingFilters = !this.isShowingFilters;
			this.filtersCollapse.toggle();
		}
	},
	template,
};
