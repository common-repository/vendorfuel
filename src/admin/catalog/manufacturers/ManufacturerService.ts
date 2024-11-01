import { vfAPI } from '../../shared/vfAPI';
import type { Localized } from '../../types';
import { Manufacturer } from './Manufacturer';
import type { Params } from '../../shared/Params';
import { Service } from '../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/manufacturers`;

export class ManufacturerService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfAPI
			.get(url, config)
			.then((response) => response.data.manufacturers);
	}

	public static async store(data: Manufacturer) {
		const response = await vfAPI.post(url, data);
		return response.data.manufacturer;
	}

	public static show(id: number | string) {
		return vfAPI
			.get(`${url}/${id}`)
			.then((response) => response.data.manufacturer);
	}

	public static async update(id: number | string, data: Manufacturer) {
		const response = await vfAPI.put(`${url}/${id}`, data);
		return response.data.manufacturer;
	}

	public static async destroy(id: number | string) {
		const response = await vfAPI.delete(`${url}/${id}`);
		return response.data;
	}
}
