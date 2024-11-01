import { vfAPI } from '../shared/vfAPI';
import type { Localized } from '../types';
import { Service } from '../shared/Service';
import { toast } from 'react-toastify';
declare const localized: Localized;

interface Gateways {
	shippo: string;
}

interface Warehouse {
	street1: string;
	city: string;
	state: string;
	zip: string;
}

type Mode = 'free' | 'rate' | 'parcel';

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/shipping`;

export class ShippingService extends Service {
	public static getMode() {
		return vfAPI.get(`${url}/mode`).then((response) => response.data.mode);
	}

	public static update(mode: Mode) {
		const data = {
			mode,
		};
		return vfAPI
			.put(`${url}/mode`, data)
			.then((response) => response.data.mode);
	}

	public static indexGateways() {
		return vfAPI
			.get(`${url}/gateways`)
			.then((response) => response.data.gateways);
	}

	public static updateGateways(gateways: Gateways) {
		const data = {
			gateways,
		};
		return vfAPI
			.put(`${url}/gateways`, data)
			.then((response) => response.data.gateways)
			.finally(() => {
				toast.info('Gateway updated.');
			});
	}

	public static indexWarehouse() {
		return vfAPI.get(`${url}/warehouse`).then((response) => response.data);
	}

	public static updateWarehouse(warehouse: Warehouse) {
		const data = {
			...warehouse,
		};
		return vfAPI
			.put(`${url}/warehouse`, data)
			.then((response) => response.data.warehouse);
	}
}
