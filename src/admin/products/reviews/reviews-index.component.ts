import template from './reviews-index.component.html';

export const ReviewsIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$location', '$state', 'Reviews'];

function controller(
	$location: ng.ILocationService,
	$state: ng.ui.IStateService,
	Reviews: any
) {
	this.$onInit = () => {
		this.breadcrumbs = [
			{ label: 'Catalog', href: '?page=vf-catalog' },
			{
				label: 'Products',
				href: '?page=vf-catalog#/products',
			},
			{
				label: 'Reviews',
				href: '?page=vendorfuel#!/catalog/products/reviews',
			},
		];
		this.isConfirmingDeletion = [];
		this.isDeleting = [];
		this.params = {
			page: $location.search().page || 1,
			q: $location.search().q || '',
			rpp: 15,
			orderBy: $location.search().orderBy || '',
			direction: $location.search().direction || '',
		};
		this.cachedQ = this.params.q;
		queryReviews();
	};

	this.cancelDelete = (e: MouseEvent, i: number) => {
		e.preventDefault();
		this.isConfirmingDeletion[i] = false;
	};

	/**
	 * @param {Object} e    Click event
	 * @param {number} page Page number
	 */
	this.changePage = (e: MouseEvent, page: number) => {
		if (e) {
			e.preventDefault();
		}
		this.params.page = page;
		submit();
	};

	/**
	 * @param {string} q Query
	 */
	this.changeQuery = (q: string) => {
		if (!q) {
			submit();
		}
	};

	/**
	 * @param {string} orderBy Sortby term
	 * @param {Object} e      Click event
	 */
	this.changeSortBy = (orderBy: string, e: MouseEvent) => {
		e.preventDefault();
		if (this.params.orderBy === orderBy) {
			this.params.direction =
				this.params.direction === 'desc' ? 'asc' : 'desc';
		} else {
			this.params.direction = 'asc';
			this.params.orderBy = orderBy;
		}
		updateSearchParams();
		queryReviews();
	};

	this.confirmDelete = (e: MouseEvent, i: number) => {
		e.preventDefault();
		this.isConfirmingDeletion[i] = true;
	};

	/**
	 * Get the reviews
	 */
	const queryReviews = () => {
		this.isLoading = true;
		Reviews.query(this.params).$promise.then((reviews: any) => {
			this.reviews = reviews;
			this.isLoading = false;
		});
	};

	this.remove = (e: MouseEvent, id: number, index: number) => {
		e.preventDefault();
		this.isDeleting[index] = true;
		Reviews.delete({ id }).$promise.then(() => {
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
		queryReviews();
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
