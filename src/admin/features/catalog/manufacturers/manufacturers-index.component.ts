import template from './manufacturers-index.component.html';

export const ManufacturersIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$location', '$state', 'Manufacturers'];

function controller(
	$location: ng.ILocationService,
	$state: ng.ui.IStateService,
	Manufacturers: any
) {
	this.action = {
		label: 'Add new',
		href: '?page=vendorfuel#!/catalog/manufacturers/create',
	};
	this.breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-admin#/catalog' },
		{
			label: 'Manufacturers',
			href: '?page=vendorfuel#!/catalog/manufacturers',
		},
	];

	this.$onInit = () => {
		this.isConfirmingDeletion = [];
		this.isDeleting = [];
		this.params = {
			page: $location.search().page || 1,
			q: $location.search().q || '',
			rpp: 15,
			sortBy: $location.search().sortBy || '',
			sortType: $location.search().sortType || '',
		};
		this.cachedQ = this.params.q;
		queryManufacturers();
	};

	this.cancelDelete = (e: MouseEvent, i: number) => {
		e.preventDefault();
		this.isConfirmingDeletion[i] = false;
	};

	/**
	 * @param {Object} e    Click event
	 * @param {number} page Page number
	 */
	this.changePage = (e: Event, page: number) => {
		if (e) {
			e.preventDefault();
		}
		this.params.page = page;
		this.submit();
	};

	/**
	 * @param {string} q Query
	 */
	this.changeQuery = (q: string) => {
		if (!q) {
			this.submit();
		}
	};

	/**
	 * @param {string} sortBy Sortby term
	 * @param {Object} e      Click event
	 */
	this.changeSortBy = (sortBy: string, e: MouseEvent) => {
		e.preventDefault();
		if (this.params.sortBy === sortBy) {
			this.params.sortType =
				this.params.sortType === 'desc' ? 'asc' : 'desc';
		} else {
			this.params.sortType = 'asc';
			this.params.sortBy = sortBy;
		}
		updateSearchParams();
		queryManufacturers();
	};

	this.confirmDelete = (e: MouseEvent, i: number) => {
		e.preventDefault();
		this.isConfirmingDeletion[i] = true;
	};

	/**
	 * Get the manufacturers
	 */
	const queryManufacturers = () => {
		this.isLoading = true;
		Manufacturers.query(this.params).$promise.then((manufacturers: any) => {
			this.manufacturers = manufacturers;
			this.isLoading = false;
		});
	};

	this.remove = (e: MouseEvent, id: number, index: number) => {
		e.preventDefault();
		this.isDeleting[index] = true;
		Manufacturers.delete({ id }).$promise.then(() => {
			this.isDeleting[index] = false;
			$state.reload();
		});
	};

	/**
	 * Submit the search form.
	 */
	this.submit = () => {
		this.cachedQ = this.params.q;
		updateSearchParams();
		queryManufacturers();
	};

	/**
	 * Update the search params in the URL.
	 */
	const updateSearchParams = () => {
		const {
			params: { q, page },
		} = this;
		$location.search('q', q ? q : null);
		$location.search('page', page > 1 ? page : null);
	};
}
