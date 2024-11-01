ManufacturersService.$inject = ['$resource'];

export function ManufacturersService($resource: any) {
	const endpoint = `${localized.apiURL}/admin/manufacturers/:id`;
	return $resource(
		endpoint,
		{ id: '@id' },
		{
			get: {
				interceptor: {
					response(response: any) {
						const {
							resource: { manufacturer },
						} = response;
						return manufacturer;
					},
				},
			},
			save: {
				method: 'POST',
				headers: { 'Content-Type': undefined },
				transformRequest(data: any) {
					const formData = new FormData();
					Object.entries(data).forEach((entry) => {
						const [key, value] = entry;
						if (value) {
							formData.append(key, value as Blob);
						}
					});
					return formData;
				},
			},
			query: {
				isArray: false,
				interceptor: {
					response(response: any) {
						const {
							resource: { manufacturers },
						} = response;
						return manufacturers;
					},
				},
			},
			update: {
				method: 'PUT',
				headers: { 'Content-Type': undefined },
				transformRequest(data: any) {
					const formData = new FormData();
					Object.entries(data).forEach((entry) => {
						const [key, value] = entry;
						if (key !== 'id' && key !== 'images') {
							formData.append(key, (value as Blob) || '');
						}
					});
					return formData;
				},
			},
		}
	);
}
