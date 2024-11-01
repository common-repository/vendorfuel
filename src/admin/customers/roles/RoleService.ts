import { vfAPI } from '../../shared/vfAPI';
import type { Localized } from '../../types';
import type { Params } from '../../shared/Params';
import { Service } from '../../shared/Service';
declare const localized: Localized;

const url = `${localized.apiURL.replace('v1', 'v2')}/admin/customers/roles`;

export class RoleService extends Service {
	public static index(params: Params) {
		const config = {
			params,
		};
		return vfAPI.get(url, config).then((response) => response.data.roles);
	}

	public static async destroy(id: number | string) {
		const response = await vfAPI.delete(`${url}/${id}`);
		return response.data;
	}
}
