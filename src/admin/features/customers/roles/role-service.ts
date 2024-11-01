import { vfApi } from '../../../lib/vf-api';
import type { Localized } from '../../../types';
import type { Params } from '../../../models/params';
import { Service } from '../../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/customers/roles`;

export class RoleService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfApi.get(url, config).then((response) => response.data.roles);
	}

	public static async destroy(id: number | string) {
		const response = await vfApi.delete(`${url}/${id}`);
		return response.data;
	}
}
