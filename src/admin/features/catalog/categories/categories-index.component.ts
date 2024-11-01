declare const angular: ng.IAngularStatic;
import { tinymceOptions } from '../../../data/tinymceOptions';
import template from './categories-index.component.html';

export const CategoriesIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'$stateParams',
	'Admin',
	'Settings',
	'Debug',
	'Utils',
	'Localized',
	'SearchModal',
];

/**
 * @param {Object} $scope       Angular service
 * @param {Object} $stateParams UI Router service
 * @param {Object} Admin        VendorFuel service
 * @param {Object} Settings     VendorFuel service
 * @param {Object} Debug        VendorFuel service
 * @param {Object} Utils        VendorFuel service
 * @param {Object} Localized    VendorFuel service
 * @param {Object} SearchModal  VendorFuel service
 */
function controller(
	$scope: any,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Settings: any,
	Debug: any,
	Utils: any,
	Localized: any,
	SearchModal: any
) {
	const vm = this;
	this.tinymceOptions = tinymceOptions;
	vm.addCategory = addCategory;
	vm.changeSortBy = changeSortBy;
	vm.changeView = changeView;
	vm.deleteCategory = deleteCategory;
	vm.editCategory = editCategory;
	vm.generateSlugs = generateSlugs;
	vm.openMediaFrame = openMediaFrame;
	vm.openParentCatSearchModal = openParentCatSearchModal;
	vm.openSearchModalAdd = openSearchModalAdd;
	vm.openSearchModalUpdate = openSearchModalUpdate;
	vm.searchCategory = searchCategory;
	vm.searchSubCategory = searchSubCategory;
	vm.ShowChanges = ShowChanges;
	vm.syncCategoryPosts = syncCategoryPosts;
	vm.tabChanged = tabChanged;
	vm.updateCategory = updateCategory;
	vm.viewParent = viewParent;

	/**
	 * Initialization
	 */
	this.init = () => {
		this.breadcrumbs = [
			{ name: 'Catalog', state: 'catalog.page' },
			{ name: 'Categories', state: 'catalog.categories.index' },
		];

		vm.activeTab = parseInt($stateParams.activeTab);
		vm.addParams = {};
		vm.brandImg = `${localized.dir.url}/assets/img/brand.png`;
		vm.categoryEndpoint = localized.apiURL + '/admin/category/';
		vm.catSlug = localized.settings.general.cat_slug || 'categories';
		vm.editedProducts = [];
		vm.editName = false;
		vm.filterBy = '';
		vm.isAuthed = Admin.Authed();
		vm.loading = false;
		vm.object = Object;
		vm.productEndpoint = localized.apiURL + '/admin/products/';
		vm.rppValues = [15, 30, 50, 100];
		vm.searchTerm = '';
		vm.selectedCategory = null;
		vm.showChanges = false;
		vm.searchParams = {
			page: 1,
			rpp: vm.rppValues[0],
		};
		vm.sortAscending = true;
	};
	this.init();

	/**
	 * @param {number} i Tab index
	 */
	function tabChanged(i: number) {
		vm.activeTab = i;
		vm.loading = true;
		vm.editedProducts = [];
		vm.showChanges = false;
		const req = {
			method: 'GET',
			url: vm.categoryEndpoint,
		};
		switch (i) {
			case 0:
				Utils.getHttpPromise(req)
					.then(
						function (resp: any) {
							vm.categories = resp.categories;
						},
						function (errResp: Error) {
							Debug.error(errResp);
						}
					)
					.finally(function () {
						vm.loading = false;
					});
				break;
			case 1:
				vm.loading = false;
				break;
			case 2:
				req.url += vm.selectedCategory.cat_id;
				Utils.getHttpPromise(req)
					.then(
						function (resp: any) {
							vm.selectedCategory = resp.category;
							if (vm.selectedCategory.parent_category) {
								vm.selectedCategory.parentCategoryTitle =
									vm.selectedCategory.parent_category.title;
							}
						},
						function (errResp: Error) {
							Debug.error(errResp);
						}
					)
					.finally(function () {
						checkCategory();
						vm.loading = false;
					});
				break;
			default:
				vm.loading = false;
				break;
		}
	}

	/**
	 */
	function syncCategoryPosts() {
		const params = {};
		const data = {};
		Utils.httpGet(
			Localized.wpRestUrl + '/syncCategoryPosts',
			params,
			data
		).then(function () {
			angular.noop();
		});
	}

	/**
	 */
	function generateSlugs() {
		const req = {
			method: 'POST',
			url: vm.categoryEndpoint + 'slug/generate',
		};
		Utils.getHttpPromise(req)
			.then(
				function () {
					angular.noop();
				},
				function (errResp: Error) {
					Debug.error(errResp);
				}
			)
			.finally(function () {
				vm.loading = false;
			});
	}

	/**
	 */
	function addCategory() {
		vm.loading = true;
		const params = {
			title: vm.addParams.title,
			parent_id: vm.addParams.parent_id || null,
			avatax_tax_code: vm.addParams.avatax_tax_code,
			unspsc: vm.addParams.unspsc,
			slug: vm.addParams.slug,
			image: vm.addParams.img_url,
			description: vm.addParams.description,
			products: [] as any,
		};
		angular.forEach(vm.addParams.products, function (value) {
			params.products.push(value.value.product_id);
		});
		params.image = vm.addParams.img_url;
		const req = {
			method: 'POST',
			url: vm.categoryEndpoint,
			data: params,
		};
		Utils.getHttpPromise(req)
			.then(
				function (resp: any) {
					if (!resp.errors.length) {
						vm.addParams = {};
						vm.selectedCategory = resp.category;
						// eslint-disable-next-line no-shadow
						const params = {
							id: resp.category.cat_id,
						};
						const data = {};
						Utils.httpGet(
							Localized.wpRestUrl + '/syncCategoryPosts',
							params,
							data
						)
							// eslint-disable-next-line no-shadow
							.then(function () {
								angular.noop();
							});
						vm.activeTab = 2;
					}
				},
				function (errResp: Error) {
					Debug.error(errResp);
				}
			)
			.finally(function () {
				vm.loading = false;
			});
	}

	/**
	 */
	function changeView() {
		vm.viewProducts = !vm.viewProducts;
	}

	/**
	 */
	function checkCategory() {
		if (vm.selectedCategory.products.data.length >= 1) {
			vm.viewProducts = true;
		} else {
			vm.viewProducts = false;
		}
	}

	/**
	 * @param {number} i Category index
	 * @param {Object} e Click event
	 */
	function editCategory(i: number, e: Event) {
		if (e) {
			e.preventDefault();
		}
		const tabIndex = 2; // Currently the Edit Category tab index.
		vm.activeTab = tabIndex;
		vm.selectedCategory = vm.categories.data[i];
	}

	/**
	 * @param {number} id Category ID
	 */
	function deleteCategory(id: number) {
		const endpoint = vm.categoryEndpoint + id;
		Utils.httpDelete(endpoint)
			.then(
				function () {
					angular.noop();
				},
				function (errResp: Error) {
					Debug.log(errResp);
				}
			)
			.finally(function () {
				vm.tabChanged(0);
				vm.selectedCategory = null;
			});
	}

	/**
	 * @param {string} image Image
	 */
	function openMediaFrame(image: string) {
		// eslint-disable-next-line no-undef
		const fileFrame = wp.media({
			title: 'Select or Upload Logo image',
			library: {
				type: 'image',
			},
			button: {
				text: 'Select',
			},
			multiple: false,
		});
		fileFrame.on('select', function () {
			$scope.$apply(function () {
				$scope.attachment = fileFrame
					.state()
					.get('selection')
					.first()
					.toJSON();
				$scope.removingImage = true;
				if (image === 'add_img') {
					vm.addParams.img_url = $scope.attachment.url;
				} else if (image === 'update_img') {
					vm.selectedCategory.img_url = $scope.attachment.url;
				}
			});
		});
		fileFrame.open();
	}

	/**
	 */
	function openSearchModalAdd() {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: vm.productEndpoint,
						params: {
							q: '',
						},
					},
					relationships: ['products', 'category'],
					fields: ['sku', 'image', 'description', 'title'],
					fieldPrefixes: ['', '', '', 'Category: '],
					id: 'product_id',
					selectOne: false,
				},
			],
			updatedItems: vm.addParams.products,
		};
		callback = {
			confirm: productSearchResults,
			cancel() {
				angular.noop();
			},
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			vm.addParams.title || 'New Category',
			data,
			'Add items'
		);
	}

	/**
	 */
	function openSearchModalUpdate() {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: vm.productEndpoint,
						params: {
							q: '',
							excludedField: 'category_id',
							excludedId: vm.selectedCategory.cat_id,
							excludedTable: 'products',
						},
					},
					relationships: ['products', 'category'],
					fields: ['sku', 'image', 'description', 'title'],
					fieldPrefixes: ['', '', '', 'Category: '],
					id: 'product_id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url: vm.categoryEndpoint + vm.selectedCategory.cat_id,
						params: {
							q: '',
							'searchFields[]': ['description', 'sku'],
						},
					},
					relationships: ['category', 'products'],
					fields: ['sku', 'image', 'description', 'status'],
					fieldPrefixes: ['', '', '', 'Category: '],
					id: 'product_id',
				},
			],
			updatedItems: vm.editedProducts,
		};
		callback = {
			confirm: productSearchResults,
			cancel() {
				angular.noop();
			},
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			vm.selectedCategory.title,
			data,
			'Add items'
		);
	}

	/**
	 */
	function openParentCatSearchModal() {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: vm.categoryEndpoint,
						params: {
							q: '',
						},
					},
					relationships: ['categories', 'parent_category'],
					fields: ['cat_id', 'title', '.cat_id', '.title'],
					fieldPrefixes: [
						'ID: ',
						'Category: ',
						'Parent ID: ',
						'Parent: ',
					],
					id: 'cat_id',
					selectOne: true,
				},
			],
		};
		callback = {
			confirm: categorySearchResults,
			cancel() {
				angular.noop();
			},
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(callback, 'Select Parent Category', data, 'Add items');
	}

	/**
	 * @param {string} sortBy Sortby term
	 * @param {Object} e      Click event
	 */
	function changeSortBy(sortBy: string, e: Event) {
		e.preventDefault();
		vm.sortAscending =
			vm.searchParams.sortBy === sortBy ? !vm.sortAscending : true;
		vm.searchParams.sortBy = sortBy;
		vm.searchParams.sortType = vm.sortAscending ? 'asc' : 'desc';
		this.searchCategories();
	}

	this.searchCategories = () => {
		vm.loadingMore = true;
		const req = {
			method: 'GET',
			url: vm.categoryEndpoint,
			params: vm.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					vm.categories = resp.categories;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				vm.loadingMore = false;
			});
	};

	this.setPage = (page: number) => {
		this.searchParams.page = page;
		this.searchCategories();
	};

	this.setRpp = (rpp: number) => {
		this.searchParams.rpp = rpp;
		this.searchCategories();
	};

	this.setQuery = (query: string) => {
		this.searchParams.page = 1; // Reset page when query changes.
		this.searchParams.q = query;
		this.searchTerm = this.searchParams.q;
		this.searchCategories();
	};

	/**
	 * @param {number} rpp  Results per page
	 * @param {number} page Page number
	 */
	function searchCategory(rpp: number, page: number) {
		vm.productsLoading = true;
		vm.searchParams.rpp = rpp;
		vm.searchParams.page = page || 1;
		vm.searchParams['searchFields[]'] = ['description', 'sku'];
		const req = {
			method: 'GET',
			url: vm.categoryEndpoint + vm.selectedCategory.cat_id,
			params: vm.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				function (resp: any) {
					vm.selectedCategory = resp.category;
					if (vm.selectedCategory.parent_category) {
						vm.selectedCategory.parentCategoryTitle =
							vm.selectedCategory.parent_category.title;
					}
				},
				function (errResp: Error) {
					Debug.error(errResp);
				}
			)
			.finally(function () {
				vm.productsLoading = false;
			});
	}

	/**
	 * @param {Object} resp Response
	 */
	function categorySearchResults(resp: any) {
		if (vm.activeTab === 1) {
			vm.addParams.parent_id = resp[0].value.cat_id;
			vm.addParams.parentCategoryTitle = resp[0].value.title;
		}
		if (vm.activeTab === 2) {
			vm.selectedCategory.parent_id = resp[0].value.cat_id;
			vm.selectedCategory.parentCategoryTitle = resp[0].value.title;
		}
	}

	/**
	 * Callback that is used by the search modal
	 *
	 * @param {Object} resp Response
	 */
	function productSearchResults(resp: any) {
		if (vm.activeTab === 1) {
			vm.addParams.products = resp;
		}
		if (vm.activeTab === 2) {
			vm.editedProducts = resp;
		}
	}

	/**
	 * @param {number} id ID
	 */
	function searchSubCategory(id: number) {
		vm.loading = true;
		const req = {
			method: 'GET',
			url: vm.categoryEndpoint + id,
		};
		Utils.getHttpPromise(req)
			.then(
				function (resp: any) {
					vm.selectedCategory = resp.category;
					if (vm.selectedCategory.parent_category) {
						vm.selectedCategory.parentCategoryTitle =
							vm.selectedCategory.parent_category.title;
					}
				},
				function (errResp: Error) {
					Debug.error(errResp);
				}
			)
			.finally(function () {
				checkCategory();
				vm.loading = false;
			});
	}

	/**
	 */
	function ShowChanges() {
		vm.showChanges = !vm.showChanges;
	}

	/**
	 */
	function updateCategory() {
		vm.loading = true;
		const params = {
			title: vm.selectedCategory.title,
			parent_id: vm.selectedCategory.parent_id || null,
			avatax_tax_code: vm.selectedCategory.avatax_tax_code,
			unspsc: vm.selectedCategory.unspsc,
			slug: vm.selectedCategory.slug,
			image: vm.selectedCategory.img_url,
			description: vm.selectedCategory.description,
			products: [] as any,
		};
		angular.forEach(vm.editedProducts, function (value) {
			params.products.push(value.value.product_id);
		});
		const req = {
			method: 'PUT',
			url: vm.categoryEndpoint + vm.selectedCategory.cat_id,
			data: params,
		};
		Utils.getHttpPromise(req).then(
			function (resp: any) {
				if (!resp.errors.length) {
					vm.tabChanged(2);
					// eslint-disable-next-line no-shadow
					const params = {
						id: resp.category.cat_id,
					};
					const data = {};
					Utils.httpGet(
						Localized.wpRestUrl + '/syncCategoryPosts',
						params,
						data
					).then(function () {
						angular.noop();
					});
				} else {
					vm.loading = false;
				}
			},
			function (errResp: Error) {
				Debug.log(errResp);
			}
		);
	}

	/**
	 */
	function viewParent() {
		vm.loading = true;
		const req = {
			method: 'GET',
			url: vm.categoryEndpoint + vm.selectedCategory.parent_id,
		};
		Utils.getHttpPromise(req)
			.then(
				function (resp: any) {
					vm.selectedCategory = resp.category;
					if (vm.selectedCategory.parent_category) {
						vm.selectedCategory.parentCategoryTitle =
							vm.selectedCategory.parent_category.title;
					}
				},
				function (errResp: Error) {
					Debug.error(errResp);
				}
			)
			.finally(function () {
				checkCategory();
				vm.loading = false;
			});
	}
}
