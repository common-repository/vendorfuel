import { batchParams } from '../../shared/batch-params';
import { vfApi } from '../../lib/vf-api';
import type { Localized } from '../../types';
import type { Params } from '../../models/params';
import { Service } from '../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/customers`;

export class CustomerService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfApi
			.get(url, config)
			.then((response) => response.data.customers);
	}

	public static async destroy(id: number | string) {
		const response = await vfApi.delete(`${url}/${id}`);
		return response.data;
	}

	public static indexBatches(params: Params) {
		const config = {
			params: batchParams(params),
		};
		return vfApi
			.get(`${url}/batches`, config)
			.then((response) => response.data.batches);
	}

	public static showBatch(id: number | string, params: Params) {
		const config = {
			params,
		};
		return vfApi
			.get(`${url}/batches/${id}`, config)
			.then((response) => response.data.batch);
	}
}
