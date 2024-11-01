import { vfAPI } from '../shared/vfAPI';
import type { Localized } from '../types';
import type { Params } from '../shared/Params';
import { Frequency, Report } from './Report';
import { Service } from '../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/reports`;

export class ReportService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfAPI.get(url, config).then((response) => response.data.reports);
	}

	public static show(id: number | string) {
		return vfAPI
			.get(`${url}/${id}`)
			.then((response) => response.data.report);
	}

	public static update(id: number | string, data: Report) {
		return vfAPI
			.put(`${url}/${id}`, data)
			.then((response) => response.data.report);
	}

	public static async destroy(id: number | string) {
		const response = await vfAPI.delete(`${url}/${id}`);
		return response.data;
	}

	public static schedule(data: {
		id: number | string;
		frequency: Frequency;
	}) {
		return vfAPI.post(`${url}/schedule`, data).then((response) => response);
	}

	public static indexDownloads(params: Params) {
		const config = {
			params,
		};
		return vfAPI
			.get(`${url}/download`, config)
			.then((response) => response.data.reports);
	}

	public static showDownload(id: number) {
		return vfAPI
			.get(`${url}/download/${id}`)
			.then((response) => response.data);
	}

	public static async download(id: number) {
		const config = {
			responseType: 'blob',
		};
		const response = await vfAPI.get(`${url}/download/${id}`, config);
		const csvData = new Blob([response.data], {
			type: 'text/csv;charset=utf-8;',
		});
		const csvURL = window.URL.createObjectURL(csvData);
		const tempLink = document.createElement('a');
		tempLink.href = csvURL;
		tempLink.setAttribute('download', `report.csv`);
		tempLink.click();
	}
}
