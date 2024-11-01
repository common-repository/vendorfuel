import { vfApi } from '../../../lib/vf-api';
import type { Localized } from '../../../types';
import type { Params } from '../../../models/params';
import { batchParams } from '../../../shared/batch-params';
import { Service } from '../../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/categories`;

export class CategoryService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfApi
			.get(url, config)
			.then((response) => response.data.categories);
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

	public static indexTreeBatches(params: Params) {
		const config = {
			params: batchParams(params),
		};
		return vfApi
			.get(`${url}/tree/batches`, config)
			.then((response) => response.data.batches);
	}

	public static showTreeBatch(id: number | string, params: Params) {
		const config = {
			params,
		};
		return vfApi
			.get(`${url}/tree/batches/${id}`, config)
			.then((response) => response.data.batch);
	}
}
