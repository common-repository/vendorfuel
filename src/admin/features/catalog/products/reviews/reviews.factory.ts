ReviewsService.$inject = ['$resource'];

export function ReviewsService($resource: ng.resource.IResourceService) {
	const endpoint = `${localized.apiURL}/admin/products/reviews/:id`;
	return $resource(
		endpoint,
		{ id: '@id' },
		{
			get: {
				method: 'GET',
				interceptor: {
					response(response: any) {
						const {
							resource: { review },
						} = response;
						return review;
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
				method: 'GET',
				isArray: false,
				interceptor: {
					response(response: any) {
						const {
							resource: { reviews },
						} = response;
						return reviews;
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
