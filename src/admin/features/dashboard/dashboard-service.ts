import { vfAPI } from '../../shared/vfAPI';
import type { Localized } from '../../types';
import type { Dashboard } from './dashboard';
import { Service } from '../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/stats/dashboard`;

export class DashboardService extends Service {
	public static dashboard() {
		return vfAPI
			.get(url)
			.then((response) => response.data.orders as Dashboard);
	}
}
