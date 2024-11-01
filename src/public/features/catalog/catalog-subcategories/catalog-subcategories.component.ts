import template from './catalog-subcategories.component.html';

interface Category {
	cat_id: number;
	parent_id: number;
	title: string;
	slug: string;
	img_url: string;
	description: string;
}

export const CatalogSubcategoriesComponent: ng.IComponentOptions = {
	template,
	bindings: {
		subcategories: '<',
	},
	controller: class CatalogSubcategoriesController {
		limit = localized.settings.general.subcategoryCardsLimit || null;
		placeholder = `${localized.dir.url}assets/img/placeholder-150px.png`;
		rootSlug: string = localized.settings.general.cat_slug;
		subcategories: Category[];
	},
};
