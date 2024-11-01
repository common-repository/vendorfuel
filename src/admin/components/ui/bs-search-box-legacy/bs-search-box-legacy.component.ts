import template from './bs-search-box-legacy.html';

export const BsSearchBoxLegacyComponent = {
	bindings: {
		isLoading: '<',
		onSubmit: '&',
		q: '<',
		searchOptions: '<?',
	},
	controller: class SearchFormController {
		onSubmit: ({
			query,
			searchBy,
		}: {
			query: string;
			searchBy: string;
		}) => void;
		q: string;
		searchBy: string;

		$onInit() {
			this.searchBy = '';
		}

		changeQuery(query: string) {
			// Refresh customers if the search field is cleared.
			if (!query) {
				this.onSubmit({ query, searchBy: this.searchBy });
			}
		}

		changeSearchBy(term: string, e: Event) {
			e.preventDefault();
			this.searchBy = term;
		}

		submit() {
			this.onSubmit({ query: this.q, searchBy: this.searchBy });
		}
	},
	template,
};
