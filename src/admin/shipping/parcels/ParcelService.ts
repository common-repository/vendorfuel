import { vfAPI } from '../../shared/vfAPI';
import type { Localized } from '../../types';
import type { Params } from '../../shared/Params';
import { Parcel } from './Parcel';
import { Frequency, Report } from '../../reports/Report';
import { Service } from '../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/shipping/parcel`;

export class ParcelService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfAPI.get(url, config).then((response) => response.data.parcels);
	}

	public static show(id: number | string) {
		return vfAPI
			.get(`${url}/${id}`)
			.then((response) => response.data.parcel);
	}

	public static store(data: Parcel) {
		return vfAPI.post(url, data).then((response) => response.data.parcel);
	}

	public static update(id: number | string, data: Parcel) {
		return vfAPI
			.put(`${url}/${id}`, data)
			.then((response) => response.data.parcel);
	}

	public static async destroy(id: number | string) {
		const response = await vfAPI.delete(`${url}/${id}`);
		return response.data;
	}
}
