import { vfAPI } from '../../shared/vfAPI';
import type { Localized } from '../../types';
import type { Params } from '../../shared/Params';
import { Supplier } from './Supplier';
import { Service } from '../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/punchout/suppliers`;

export class SupplierService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfAPI
			.get(url, config)
			.then((response) => response.data.suppliers);
	}

	public static async store(data: Supplier) {
		const response = await vfAPI.post(url, data);
		return response.data.supplier;
	}

	public static async show(id: number | string) {
		const response = await vfAPI.get(`${url}/${id}`);
		return response.data.supplier;
	}

	public static async update(id: number | string, data: Supplier) {
		const response = await vfAPI.put(`${url}/${id}`, data);
		return response.data.supplier;
	}

	public static async destroy(id: number | string) {
		const response = await vfAPI.delete(`${url}/${id}`);
		return response.data;
	}

	public static async refresh(id: number | string) {
		const response = await vfAPI.get(`${url}/${id}/endpoints/refresh`);
		return response.data;
	}
}
