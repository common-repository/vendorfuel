import { vfAPI } from '../shared/vfAPI';
import { Service } from '../shared/Service';
import type { Localized } from '../types';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/orders`;

export class OrderService extends Service {
	public static index(params: unknown) {
		const config = {
			params,
		};
		return vfAPI
			.get(url, config)
			.then((response) => response.data.orders.data);
	}
}
