import template from './review-edit.component.html';
import type { Review } from '../../catalog/products/reviews/Review';

export const ReviewEdit: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$state', '$stateParams', 'Reviews'];

function controller(
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Reviews: any
) {
	this.$onInit = () => {
		this.productSlug =
			localized.settings.general.product_slug || 'products';
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

		if ($stateParams.id) {
			this.getReview($stateParams.id);
		}
	};

	this.approve = () => {
		const body = {
			status: 'approved',
		};
		Reviews.update({ id: this.review.id }, body).$promise.then(() => {
			$state.reload();
		});
	};

	this.getReview = (id: number) => {
		this.isLoading = true;
		Reviews.get({ id }).$promise.then((review: any) => {
			this.review = review;
			this.updateBreadcrumb(this.review);
			this.isLoading = false;
		});
	};

	this.remove = () => {
		this.isDeleting = true;
		Reviews.delete({ id: this.review.id }).$promise.then(() => {
			this.isDeleting = false;
			$state.go('reviews.index');
		});
	};

	this.updateBreadcrumb = (review?: Review) => {
		if (review) {
			this.breadcrumbs.push({
				label: review.title,
				href: `?page=vendorfuel#!/catalog/products/review/${this.review.id}`,
			});
		}
	};
}
