import { vfApi } from '../../lib/vf-api';
import type { Localized } from '../../types';
import type { Params } from '../../models/params';
import { saveAs } from 'file-saver';
import { Service } from '../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/reports/download`;

export class ReportDownloadService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfApi.get(url, config).then((response) => response.data.reports);
	}

	public static show(id: number | string) {
		return vfApi.get(`${url}/${id}`).then((response) => response.data);
	}

	public static async destroy(id: number | string) {
		const response = await vfApi.delete(`${url}/${id}`);
		return response.data;
	}

	public static async download(id: number, item: { filename: string }) {
		const { filename } = item;
		const config = {
			responseType: 'blob',
		};
		const response = await vfApi.get(`${url}/${id}`, config);
		const blob = new Blob([response.data], {
			type: 'text/csv;charset=utf-8;',
		});
		saveAs(blob, filename || 'report.csv');
	}
}
