import template from './sidebar-category-menu.component.html';

export const SidebarCategoryMenuComponent: ng.IComponentOptions = {
	template,
	controller: SidebarCategoryMenuController,
};

SidebarCategoryMenuController.$inject = ['Products', 'Utils'];

function SidebarCategoryMenuController(Products, Utils) {
	const vm = this;
	vm.$onInit = $onInit;
	vm.categories = [];
	vm.catId = 0;
	vm.catSlug = localized.settings.general.catSlug || 'categories';
	vm.catalogUrl = Utils.getPageUrl('catalog');
	vm.currCat = [];
	vm.getCategoryUrl = getCategoryUrl;
	vm.onClickBack = onClickBack;
	vm.onClickCategory = onClickCategory;
	vm.parentId = 0;
	vm.level = 0;

	/**
	 * Initialization.
	 */
	function $onInit() {
		getCategories();
	}

	/**
	 * @param {number} id Category ID.
	 */
	function getCategories(id?) {
		vm.isLoading = true;
		Products.categories(id).then((data) => {
			vm.categories[vm.level] = data.categories;
			vm.isLoading = false;
		});
	}

	/**
	 * @param {Object} category Category data.
	 * @return {string} Category URL.
	 */
	function getCategoryUrl(category) {
		if (!category.subcategories.length) {
			return `/${vm.catSlug}/${category.slug}`;
		}
		return '#';
	}

	/**
	 * @param {Object} category Category data.
	 * @param {Object} e        Click event.
	 */
	function onClickCategory(category, e) {
		if (category.subcategories.length) {
			e.preventDefault();
			vm.parentId = category.parent_id;
			getCategories(category.cat_id);
			vm.level++;
			vm.currCat[vm.level] = category;
		}
	}

	/**
	 * @param {Object} e Click event.
	 */
	function onClickBack(e) {
		e.preventDefault();
		vm.level--;
	}
}
