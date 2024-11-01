import { saveAs } from 'file-saver';
import { vfApi } from '../../../lib/vf-api';
import type { Localized } from '../../../types';
import type { Params } from '../../../models/params';
import { Service } from '../../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/products/exports`;

export class ProductExportService extends Service {
	public static async index(params: Params) {
		const config = {
			params,
		};
		const response = await vfApi.get(url, config);
		return response.data.exports;
	}

	public static async destroy(id: number | string) {
		const response = await vfApi.delete(`${url}/${id}`);
		return response.data;
	}

	public static async startExport() {
		const response = await vfApi.get(`${url}/start`);
		return response;
	}

	public static async download(
		id: number | string,
		filename: string = 'products.zip'
	) {
		// Fetch first to make sure there are no errors.
		const testResponse = await vfApi.get(`${url}/${id}/download`);

		// Refetch download file, using different response type.
		if (!testResponse.data.errors) {
			const config = {
				responseType: 'arraybuffer',
			};

			const response = await vfApi.get(`${url}/${id}/download`, config);
			const blob = new Blob([response.data], {
				type: 'application/zip',
			});
			saveAs(blob, filename);
		}
	}
}
