import template from './categories-utilities.component.html';
import { apiURL } from '../../../data/apiURL';
import breadcrumbBase from './breadcrumbs.json';
import type { Localized } from '../../../types';
declare const localized: Localized;

export const CategoriesUtilities: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$http'];

function controller($http: ng.IHttpService) {
	this.breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Utilities',
			href: '?page=vendorfuel#!/catalog/categories/utilities',
		},
	];
	this.categoriesRoot = `${location.origin}/${localized.settings.general.cat_slug}`;

	this.handleSyncPages = () => {
		this.isBusy = true;
		const url = `${localized.dir.wpRestUrl}vendorfuel/syncCategoryPosts`;

		$http.get(url).then(() => {
			this.isBusy = false;
		});
	};

	this.handleGenerateSlugs = () => {
		this.isBusy = true;
		const url = `${apiURL.CATEGORIES}/slug/generate`;
		$http.post(url, {}).then(() => {
			this.isBusy = false;
		});
	};

	this.handleFillImages = () => {
		this.isBusy = true;
		const url = `${apiURL.CATEGORIES}/images/fill`;
		$http.post(url, {}).then((response) => {
			this.isBusy = false;
		});
	};
}
