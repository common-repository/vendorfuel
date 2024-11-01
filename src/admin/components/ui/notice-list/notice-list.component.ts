import template from './notice-list.component.html';
import { Notice } from '../Notice';

export const NoticeList: ng.IComponentOptions = {
	bindings: {
		notices: '<',
	},
	template,
	controller: class NoticeListController {
		notices: Notice[] = [];

		dismiss(i: number) {
			if (this.notices?.length) {
				this.notices.splice(i, 1);
			}
		}
	},
};
