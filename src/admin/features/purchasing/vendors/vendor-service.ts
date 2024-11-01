import { vfApi } from '../../../lib/vf-api';
import type { Localized } from '../../../types';
import type { Params } from '../../../models/params';
import { Vendor } from './vendor';
import { Service } from '../../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/purchasing/vendors`;

export class VendorService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfApi.get(url, config).then((response) => response.data.vendors);
	}

	public static async store(data: Vendor) {
		const response = await vfApi.post(url, data);
		return response.data.vendor;
	}

	public static show(id: number | string) {
		return vfApi
			.get(`${url}/${id}`)
			.then((response) => response.data.vendor);
	}

	public static async update(id: number | string, data: Vendor) {
		const response = await vfApi.put(`${url}/${id}`, data);
		return response.data.vendor;
	}

	public static async destroy(id: number | string) {
		const response = await vfApi.delete(`${url}/${id}`);
		return response.data;
	}
}
