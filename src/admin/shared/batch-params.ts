import type { Params } from '../models/params';

/**
 * @param input
 * @return Params without searchBy field which will cause API errors.
 */
export const batchParams = (input: Params) => {
	const params = { ...input };
	if (params.hasOwnProperty('searchBy')) {
		delete params.searchBy;
	}
	return params;
};
