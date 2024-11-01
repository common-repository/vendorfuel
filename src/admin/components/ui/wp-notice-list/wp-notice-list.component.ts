import { Notice } from '../Notice';

import template from './wp-notice-list.html';

export const WpNoticeListComponent = {
	controller: class NoticeController {
		static $inject: string[] = ['Localized'];
		private Localized;
		noticeList: Notice[];

		constructor(Localized: any) {
			this.Localized = Localized;
		}

		$onInit() {
			this.noticeList = this.Localized.getNotifications();
		}

		dismiss(i: number) {
			this.Localized.deleteNotification(i);
		}
	},
	template,
};
