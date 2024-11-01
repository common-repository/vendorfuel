import { vfApi } from '../../../lib/vf-api';
import type { Localized } from '../../../types';
import { Service } from '../../../shared/Service';
declare const localized: Localized;

interface ClearSale {
	enabled: boolean;
	sandbox: boolean;
	apiKey: string;
	clientID: string;
	clientSecret: string;
}

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/fraud/clearsale`;

export class FraudService extends Service {
	public static async show() {
		const response = await vfApi.get(url);
		return response.data.clearSale;
	}

	public static async store(data: ClearSale) {
		const response = await vfApi.post(url, data);
		return response.data.report;
	}

	public static async destroy() {
		const response = await vfApi.delete(url);
		return response.data;
	}
}
