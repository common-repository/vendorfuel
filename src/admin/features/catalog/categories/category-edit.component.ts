import angular from 'angular';
import template from './category-edit.component.html';
import { Category } from '../../../catalog/categories/Category';
import breadcrumbBase from './breadcrumbs.json';
import type { Localized } from '../../../types';
import { toast } from 'react-toastify';

declare const localized: Localized;
declare const wp: any;

export const CategoryEdit: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$scope',
	'$stateParams',
	'Admin',
	'Settings',
	'Debug',
	'Utils',
	'SearchModal',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Settings: any,
	Debug: any,
	Utils: any,
	SearchModal: any
) {
	this.breadcrumbs = breadcrumbBase;
	this.category = new Category();
	this.categoryEndpoint = localized.apiURL + '/admin/category/';
	this.catSlug = localized.settings.general.cat_slug || 'categories';
	this.editedProducts = [];
	this.filterBy = '';
	this.isAuthed = Admin.Authed();
	this.isExpanded = [];
	this.loading = true;
	this.object = Object;
	this.productEndpoint = localized.apiURL + '/admin/products/';
	this.searchTerm = '';
	this.searchParams = {
		page: 1,
	};
	this.sortAscending = true;
	this.tabs = [
		{ label: 'Products', id: 'products' },
		{ label: 'Subcategories', id: 'categories' },
	];
	this.active = this.tabs[0].id;

	Settings.errors = {};

	this.$onInit = () => {
		show($stateParams.id);
	};

	this.handleSubmit = () => {
		update();
	};

	this.setActive = (id: string) => {
		this.active = id;
	};

	const show = (id: number) => {
		const req = {
			method: 'GET',
			url: this.categoryEndpoint + id,
		};
		Utils.getHttpPromise(req)
			.then(
				(response: any) => {
					this.category = response.category;
					this.breadcrumbs = [
						...breadcrumbBase,
						{
							label: response.category.title,
							href: `?page=vendorfuel#!/catalog/categories/${$stateParams.id}`,
						},
					];
					if (this.category.parent_category) {
						this.category.parentCategoryTitle =
							this.category.parent_category.title;
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.loading = false;
				this.hasResolved = true;
			});
	};

	this.deleteCategory = (id: number) => {
		const endpoint = this.categoryEndpoint + id;
		Utils.httpDelete(endpoint)
			.then(
				() => {
					angular.noop();
				},
				(errResp: Error) => {
					Debug.log(errResp);
				}
			)
			.finally(() => {
				location.assign('?page=vf-catalog#/categories');
				this.category = null;
			});
	};

	this.handleExport = (id: number) => {
		this.isBusy = true;
		const url = `${localized.apiURL.replace(
			'v1',
			'v2'
		)}/admin/categories/${id}/export`;
		$http.post(url, {}).then(() => {
			this.isBusy = false;
			toast.info(
				'Go to Catalog > Products > Product exports to view any exported products.',
				{ autoClose: 10000, delay: 3000 }
			);
		});
	};

	/**
	 * @param {string} image Image
	 */
	this.openMediaFrame = (image: string) => {
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
		fileFrame.on('select', () => {
			$scope.$apply(() => {
				$scope.attachment = fileFrame
					.state()
					.get('selection')
					.first()
					.toJSON();
				$scope.removingImage = true;
				if (image === 'add_img') {
					this.category.img_url = $scope.attachment.url;
				} else if (image === 'update_img') {
					this.category.img_url = $scope.attachment.url;
				}
			});
		});
		fileFrame.open();
	};

	this.openSearchModalAdd = () => {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: this.productEndpoint,
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
			updatedItems: this.category.products,
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
			this.category.title || 'New Category',
			data,
			'Add items'
		);
	};

	this.openSearchModalUpdate = () => {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: this.productEndpoint,
						params: {
							q: '',
							excludedField: 'category_id',
							excludedId: this.category.cat_id,
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
						url: this.categoryEndpoint + this.category.cat_id,
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
			updatedItems: this.editedProducts,
		};
		callback = {
			confirm: productSearchResults,
			cancel() {
				angular.noop();
			},
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(callback, this.category.title, data, 'Add items');
	};

	/**
	 */
	this.openParentCatSearchModal = () => {
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: this.categoryEndpoint,
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
	};

	/**
	 * @param {string} orderBy Sortby term
	 * @param {Object} e      Click event
	 */
	this.changeSortBy = (orderBy: string, e: Event) => {
		e.preventDefault();
		this.sortAscending =
			this.searchParams.orderBy === orderBy ? !this.sortAscending : true;
		this.searchParams.orderBy = orderBy;
		this.searchParams.direction = this.sortAscending ? 'asc' : 'desc';
		this.searchCategories();
	};

	this.searchCategories = () => {
		this.loadingMore = true;
		const req = {
			method: 'GET',
			url: this.categoryEndpoint,
			params: this.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					this.categories = resp.categories;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.loadingMore = false;
			});
	};

	this.setPage = (page: number) => {
		this.searchParams.page = page;
		this.searchCategories();
	};

	this.setQuery = (query: string) => {
		this.searchParams.page = 1; // Reset page when query changes.
		this.searchParams.q = query;
		this.searchTerm = this.searchParams.q;
		this.searchCategories();
	};

	this.searchCategory = (page: number) => {
		this.productsLoading = true;
		this.searchParams.page = page || 1;
		this.searchParams['searchFields[]'] = ['description', 'sku'];
		const req = {
			method: 'GET',
			url: this.categoryEndpoint + this.category.cat_id,
			params: this.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					this.category = resp.category;
					if (this.category.parent_category) {
						this.category.parentCategoryTitle =
							this.category.parent_category.title;
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.productsLoading = false;
			});
	};

	/**
	 * @param {Object} resp Response
	 */
	const categorySearchResults = (resp: any) => {
		this.category.parent_id = resp[0].value.cat_id;
		this.category.parentCategoryTitle = resp[0].value.title;
	};

	/**
	 * Callback that is used by the search modal
	 *
	 * @param {Object} resp Response
	 */
	const productSearchResults = (resp: any) => {
		this.editedProducts = resp;
	};

	this.searchSubCategory = (id: number) => {
		this.loading = true;
		const req = {
			method: 'GET',
			url: this.categoryEndpoint + id,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					this.category = resp.category;
					if (this.category.parent_category) {
						this.category.parentCategoryTitle =
							this.category.parent_category.title;
					}
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.loading = false;
			});
	};

	function syncCategory(id: number) {
		const url = `${location.origin}/wp-json/vendorfuel/syncCategoryPosts?id=${id}`;
		return $http.get(url);
	}

	const update = () => {
		this.isBusy = true;
		const url = `${this.categoryEndpoint}${this.category.cat_id}`;
		const data = {
			title: this.category.title,
			parent_id: this.category.parent_id || null,
			avatax_tax_code: this.category.avatax_tax_code,
			unspsc: this.category.unspsc,
			slug: this.category.slug,
			image: this.category.img_url,
			description: this.category.description,
			meta: this.category.meta,
			products: this.editedProducts.map(
				(product) => product.value.product_id
			),
		};

		$http
			.put(url, data)
			.then((response) => {
				if (response?.data?.category) {
					const id = response.data.category.cat_id;
					this.editedProducts = [];
					show(id);
					syncCategory(id).then(() => {
						this.isBusy = false;
					});
				}
			})
			.catch((error) => console.error(error))
			.finally(() => {
				this.isBusy = false;
			});
	};
}
