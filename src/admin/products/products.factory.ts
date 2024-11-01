ProductsService.$inject = ['Utils'];

export function ProductsService(Utils: any) {
	let categories = [] as any;
	let parcels = [] as any;
	const selectOptions = {
		description: 'Description',
		sku: 'SKU',
		mfg_part_num: 'Mfg Part Num',
		manufacturer: 'Manufacturer',
	};
	const termOptions = {
		like: 'Contains',
		'not like': 'Does Not Contain',
		'=': 'Equals (=)',
		'!=': 'Does Not Equal (!=)',
		'>': 'Greater Than (>)',
		'<': 'Less Than (<)',
	};
	const statuses = {
		active: 'Active',
		discontinued: 'Discontinued',
		inactive: 'Inactive',
		backordered: 'Backordered',
	};

	/**
	 * @return {Object} Promise
	 */
	function setCategories() {
		const req = {
			method: 'GET',
			url: localized.apiURL + '/admin/category/',
			params: {
				rpp: 999,
			},
		};
		return Utils.getHttpPromise(req).then((resp: any) => {
			categories = resp.categories;
			return resp;
		});
	}
	/**
	 * @return {Array} Categories
	 */
	function getCategories() {
		return categories;
	}
	/**
	 * @return {Object} Response
	 */
	function setParcels() {
		return Utils.httpGet(localized.apiURL + '/admin/shipping/parcel').then(
			(resp: any) => {
				parcels = resp.parcels;
				return resp;
			}
		);
	}
	/**
	 * @return {Array} Parcels
	 */
	function getParcels() {
		return parcels;
	}
	/**
	 * @return {any} Term Options
	 */
	function getTermOptions() {
		return termOptions;
	}
	/**
	 * @return {any} Select Options
	 */
	function getSelectOptions() {
		return selectOptions;
	}
	/**
	 * @return {any} Statuses
	 */
	function getStatuses() {
		return statuses;
	}

	return {
		setCategories,
		getCategories,
		setParcels,
		getParcels,
		getSelectOptions,
		getTermOptions,
		getStatuses,
	};
}
