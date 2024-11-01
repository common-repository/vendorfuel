import template from './bs-badge.html';

export const BsBadgeComponent = {
	bindings: {
		label: '<',
	},
	template,
	transclude: true,
	controller: class BadgeController {
		bgClass: string;
		label: string;

		$onInit() {
			this.bgClass = this.getBgClass(this.label);
		}

		getBgClass(label: string) {
			if (label.includes('approved')) {
				return 'bg-success';
			} else if (label.includes('denied')) {
				return 'bg-danger';
			} else if (label.includes('pending')) {
				return 'bg-warning';
			}
			return 'bg-secondary';
		}
	},
};
