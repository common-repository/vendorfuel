import { saveAs } from 'file-saver';
import { batchParams } from '../../../shared/batch-params';
import { vfApi } from '../../../lib/vf-api';
import type { Localized } from '../../../types';
import type { Params } from '../../../models/params';
import { Service } from '../../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/products`;

export class ProductService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfApi
			.get(url, config)
			.then((response) => response.data.products);
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

	public static indexExports(params: Params) {
		const config = {
			params: batchParams(params),
		};
		return vfApi
			.get(`${url}/exports`, config)
			.then((response) => response.data.exports);
	}

	public static async startExport() {
		const response = await vfApi.get(`${url}/exports/start`);
		return response;
	}

	public static async storeInventory(file: File) {
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const data = new FormData();
		data.append('file', file);
		const response = await vfApi.post(`${url}/inventory`, data, config);
		return response.data;
	}

	public static async download(
		id: number | string,
		filename: string = 'products.zip'
	) {
		// Fetch first to make sure there are no errors.
		const testResponse = await vfApi.get(`${url}/exports/${id}/download`);

		// Refetch download file, using different response type.
		if (!testResponse.data.errors) {
			const config = {
				responseType: 'arraybuffer',
			};

			const response = await vfApi.get(
				`${url}/exports/${id}/download`,
				config
			);
			const blob = new Blob([response.data], {
				type: 'application/zip',
			});
			saveAs(blob, filename);
		}
	}
}
