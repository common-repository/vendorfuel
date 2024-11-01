import template from './latest-comments.component.html';

export const LatestComments: ng.IComponentOptions = {
	bindings: {
		comments: '<',
	},
	controller: class Controller {
		ratingTotal: number = 5;

		getRepeater() {
			return new Array(this.ratingTotal);
		}
	},
	template,
};
