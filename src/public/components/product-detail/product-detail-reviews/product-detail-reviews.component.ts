import angular from 'angular';
import '../product-review.service';
import template from './product-detail-reviews.html';

/**
 * Product Detail Reviews Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('productDetailReviews', {
		bindings: {
			averageRating: '<',
			getReviewTotal: '&',
			productId: '<',
		},
		controller: ReviewsController,
		template,
	});

	ReviewsController.$inject = ['$location', 'User', 'Utils', 'ProductReview'];

	function ReviewsController(
		$location: any,
		User: any,
		Utils: any,
		ProductReview: any
	) {
		const vm = this;
		vm.$onInit = $onInit;
		vm.changePage = changePage;
		vm.createReview = createReview;
		vm.submitReview = submitReview;

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.isSignedIn = User.isAuthed && User.email;
			vm.pageUrls = {
				contact: Utils.getPageUrl('contact'),
				login: Utils.getPageUrl('login', {
					redirect_to: $location.path(),
				}),
				register: Utils.getPageUrl('register'),
			};
			vm.page = 1;
			getReviews();
		}

		function changePage(page: number, e: Event) {
			e.preventDefault();
			vm.page = page;
			getReviews();
		}

		/**
		 * @param {Array} results Reviews
		 * @return {Array} Histogram
		 */
		function createHistogram(results) {
			const stars: Array<number> = [
				results.five_star_total,
				results.four_star_total,
				results.three_star_total,
				results.two_star_total,
				results.one_star_total,
			];
			const histogram = stars.map((element, index) => {
				return {
					stars: index + 1,
					total: Number(element),
					percentage: (Number(element) / Number(results.total)) * 100,
				};
			});

			return histogram;
		}

		function createReview() {
			vm.isWritingReview = true;

			vm.review = new ProductReview({
				display_name: User.name,
				email: User.email,
				rating: 5,
			});
		}

		/**
		 * Get the product reviews.
		 */
		function getReviews() {
			vm.isLoading = true;
			const { productId } = vm;

			ProductReview.get({ productId, page: vm.page }).$promise.then(
				(response) => {
					const { reviews } = response;
					vm.reviews = reviews;

					vm.getReviewTotal({ total: vm.reviews.total });
					vm.histogram = createHistogram(vm.reviews);
					vm.isLoading = false;
				}
			);
		}

		/**
		 * @name submitReview
		 * @memberof Components.ProductController
		 */
		function submitReview() {
			vm.isSubmittingReview = true;
			const { productId } = vm;

			vm.review.$save({ productId }).then((response) => {
				vm.isSubmittingReview = false;
				vm.reviewSubmitted = true;
			});
		}
	}
})();
