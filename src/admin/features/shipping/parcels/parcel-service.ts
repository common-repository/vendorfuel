import { vfApi } from '../../../lib/vf-api';
import type { Localized } from '../../../types';
import type { Params } from '../../../models/params';
import { Parcel } from './parcel';
import { Service } from '../../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/shipping/parcel`;

export class ParcelService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfApi.get(url, config).then((response) => response.data.parcels);
	}

	public static show(id: number | string) {
		return vfApi
			.get(`${url}/${id}`)
			.then((response) => response.data.parcel);
	}

	public static store(data: Parcel) {
		return vfApi.post(url, data).then((response) => response.data.parcel);
	}

	public static update(id: number | string, data: Parcel) {
		return vfApi
			.put(`${url}/${id}`, data)
			.then((response) => response.data.parcel);
	}

	public static async destroy(id: number | string) {
		const response = await vfApi.delete(`${url}/${id}`);
		return response.data;
	}
}
