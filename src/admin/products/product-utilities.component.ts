import template from './product-utilities.component.html';
import type { Localized } from '../types';
declare const localized: Localized;

export const ProductUtilities: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$http'];

function controller($http: ng.IHttpService) {
	this.breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-catalog' },
		{ label: 'Products', href: '?page=vf-catalog#/products' },
		{ label: 'Utilities', href: '?page=vendorfuel#!/catalog/utilities' },
	];

	this.syncProductWPPosts = () => {
		this.isSyncing = true;
		const url = `${localized.dir.wpRestUrl}vendorfuel/syncProductPosts`;
		$http.get(url).then(() => {
			this.isSyncing = false;
		});
	};

	this.generateSlugs = () => {
		this.isGenerating = true;
		const url = `${localized.apiURL}/admin/products/slug/generate`;

		$http.post(url, {}).then(() => {
			this.isGenerating = false;
		});
	};
}
