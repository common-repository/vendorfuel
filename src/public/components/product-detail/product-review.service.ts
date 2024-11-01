declare let localized: any;

angular.module('vfApp').factory('ProductReview', ProductReview);

ProductReview.$inject = ['$resource'];

function ProductReview($resource: ng.resource.IResourceService) {
	const endpoint = `${localized.apiURL}/catalog/products/:productId/reviews`;
	return $resource(endpoint, { productId: '@id' });
}
