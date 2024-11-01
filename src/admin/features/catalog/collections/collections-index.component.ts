// @ts-ignore
import template from './collections-index.component.html';
import { tinymceOptions } from '../../../data/tinymceOptions';
import type { Localized } from '../../../types';
import type { ViewModalService } from './view-modal.service';

declare const angular: ng.IAngularStatic;
declare const localized: Localized;
declare const wp: any;

export const CollectionsIndex: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$scope',
	'$state',
	'$stateParams',
	'Admin',
	'Debug',
	'Utils',
	'SearchModal',
	'ViewModal',
];

function controller(
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Debug: any,
	Utils: any,
	SearchModal: any,
	ViewModal: ViewModalService
) {
	this.tinymceOptions = tinymceOptions;

	this.$onInit = () => {
		this.breadcrumbs = [
			{ name: 'Catalog', state: 'catalog.page' },
			{ name: 'Collections', state: 'catalog-collection' },
		];

		$scope.activeTab = parseInt($stateParams.activeTab);
		$scope.addParams = {
			products: [],
			categories: [],
		};
		$scope.categoryEndpoint = localized.apiURL + '/admin/category/';
		$scope.collectionEndpoint =
			localized.apiURL + '/admin/product/collection/';
		$scope.editedCategories = [];
		$scope.editedProducts = [];
		$scope.editName = false;
		$scope.isAuthed = Admin.Authed();
		$scope.loading = false;
		$scope.loadingMore = false;
		$scope.productEndpoint = localized.apiURL + '/admin/products/';
		$scope.productsLoading = false;
		$scope.object = Object;
		$scope.rppValues = [15, 30, 50, 100];
		$scope.per_page = $scope.rppValues[0]; // Must be defined after rppValues declaration.
		$scope.saved = false;
		$scope.saving = false;
		$scope.searchParams = {};
		$scope.searchTerm = '';
		$scope.searchTypes = {
			PRODUCTS: 'PRODUCTS',
			CATEGORIES: 'CATEGORIES',
		};
		$scope.searchType = $scope.searchTypes.PRODUCTS; // Must be defined after searchTypes declaration.
		$scope.selectedCollection = null; //Collection to show in the view tab
		$scope.showChanges = false;

		this.allColSearchParams = {
			q: '',
			sortBy: '',
			sortType: '',
			rpp: $scope.rppValues[0], // Must be defined after rppValues declaration.
		};
		this.sortAscending = true;

		//If the view tab is selected, redirect to the search page since selected product is null
		if ($scope.activeTab === 2) {
			$scope.activeTab = 0;
			$scope.TransitionState();
		}
	};

	$scope.LoginCallback = () => {
		$scope.loading = true;
		//logged in, do something. i.e. make api calls to load current tab's data
	};

	$scope.SearchResults = (resp: any) => {
		//callback that is used by the search modal
		if ($scope.activeTab === 1) {
			switch ($scope.searchType) {
				case $scope.searchTypes.PRODUCTS:
					$scope.addParams.products = resp;
					break;
				case $scope.searchTypes.CATEGORIES:
					$scope.addParams.categories = resp;
					break;
			}
		} else if ($scope.activeTab === 2) {
			switch ($scope.searchType) {
				case $scope.searchTypes.PRODUCTS:
					$scope.editedProducts = resp;
					break;
				case $scope.searchTypes.CATEGORIES:
					$scope.editedCategories = resp;
					break;
			}
		}
	};
	$scope.SearchCancelled = () => {
		//callback that is used by the search modal
	};
	$scope.TransitionState = () => {
		$state.go('catalog.collections.index', { activeTab: $scope.activeTab });
	};

	const getCollections = () => {
		const req = {
			method: 'GET',
			url: $scope.collectionEndpoint,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.collections = resp.collections;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	const editCollection = () => {
		const req = {
			method: 'GET',
			url: $scope.collectionEndpoint,
		};
		req.url += $scope.selectedCollection.id;
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.selectedCollection = resp.collection;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loading = false;
			});
	};

	$scope.TabChanged = (i: number) => {
		$scope.activeTab = i;
		$scope.loading = true;
		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		const req = {
			method: 'GET',
			url: $scope.collectionEndpoint,
		};
		switch (i) {
			case 0:
				getCollections();
				break;
			case 1:
				$scope.loading = false;
				break;
			case 2:
				editCollection();
				break;
		}
	};
	$scope.ChangeTab = (
		tabIndex: number,
		collectionIndex: number,
		event?: Event
	) => {
		if (event) {
			event.preventDefault();
		}
		$scope.activeTab = tabIndex;
		$scope.selectedCollection = $scope.collections.data[collectionIndex];
	};

	$scope.OpenSearchModalUpdate = () => {
		$scope.searchType = $scope.searchTypes.PRODUCTS;
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.productEndpoint,
						params: {
							q: '',
							excludedField: 'collection_id',
							excludedId: $scope.selectedCollection.id,
							excludedTable: 'product_collection',
						},
					},
					relationships: ['products'],
					fields: ['sku', 'image', 'description', 'status'],
					fieldPrefixes: ['', '', '', 'Status: '],
					id: 'product_id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url:
							$scope.collectionEndpoint +
							$scope.selectedCollection.id,
						params: {
							q: '',
							'searchFields[]': ['description', 'sku'],
						},
					},
					relationships: ['collection', 'products'],
					fields: ['sku', 'image', 'description', 'status'],
					fieldPrefixes: ['', '', '', 'Status: '],
					id: 'product_id',
				},
			],
			updatedItems: $scope.editedProducts,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			$scope.selectedCollection.name,
			data,
			'Add Products'
		);
	};
	$scope.OpenSearchModalAdd = () => {
		$scope.searchType = $scope.searchTypes.PRODUCTS;
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.productEndpoint,
						params: {
							q: '',
						},
					},
					relationships: ['products'],
					fields: ['sku', 'image', 'description', 'status'],
					fieldPrefixes: ['', '', '', 'Status: '],
					id: 'product_id',
					selectOne: false,
				},
			],
			updatedItems: $scope.addParams.products,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			$scope.addParams.name || 'New Collection',
			data,
			'Add Products'
		);
	};
	$scope.OpenSearchModalCategoryUpdate = () => {
		$scope.searchType = $scope.searchTypes.CATEGORIES;
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.categoryEndpoint,
						params: {
							q: '',
							excludedField: 'collection_id',
							excludedId: $scope.selectedCollection.id,
							excludedTable: 'category_collection',
						},
					},
					relationships: ['categories'],
					fields: ['title'],
					fieldPrefixes: [''],
					id: 'cat_id',
					selectOne: false,
				},
				{
					http: {
						method: 'GET',
						url:
							$scope.collectionEndpoint +
							$scope.selectedCollection.id,
						params: {
							q: '',
							'searchFields[]': ['description', 'title'],
						},
					},
					relationships: ['collection', 'categories'],
					fields: ['title'],
					fieldPrefixes: [''],
					id: 'cat_id',
				},
			],
			updatedItems: $scope.editedCategories,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			$scope.selectedCollection.name,
			data,
			'Add Categories'
		);
	};
	$scope.OpenSearchModalCategoryAdd = () => {
		$scope.searchType = $scope.searchTypes.CATEGORIES;
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: $scope.categoryEndpoint,
						params: {
							q: '',
						},
					},
					relationships: ['categories'],
					fields: ['description', 'title'],
					fieldPrefixes: ['', ''],
					id: 'cat_id',
					selectOne: false,
				},
			],
			updatedItems: $scope.addParams.categories,
		};
		callback = {
			confirm: $scope.SearchResults,
			cancel: $scope.SearchCancelled,
		};
		//callback object (confirm, cancel), title, message, optionCancel, optionConfirm, httpConfig
		SearchModal.Show(
			callback,
			$scope.addParams.name || 'New Collection',
			data,
			'Add Categories'
		);
	};

	this.handleEditProduct = (product) => {
		$scope.OpenViewModal(product);
	};

	$scope.OpenViewModal = function (product: any) {
		$scope.callback = {};
		const callback = {
			confirm() {
				$scope.TabChanged(2);
			},
			cancel: $scope.SearchCancelled,
		};
		ViewModal.show(callback, product);
	};

	/**
	 * @param {string} sortBy Sortby term
	 * @param {Object} e      Click event
	 */
	this.changeSortBy = (sortBy: string, e: Event) => {
		e.preventDefault();
		this.sortAscending =
			this.allColSearchParams.sortBy === sortBy
				? !this.sortAscending
				: true;
		this.allColSearchParams.sortBy = sortBy;
		this.allColSearchParams.sortType = this.sortAscending ? 'asc' : 'desc';
		$scope.SearchCollections(this.allColSearchParams.page);
	};

	$scope.SearchCollections = (page: number, query: string) => {
		$scope.loadingMore = true;
		this.allColSearchParams.q = query;
		$scope.searchTerm = this.allColSearchParams.q;
		this.allColSearchParams.page = page || 1;
		const req = {
			method: 'GET',
			url: $scope.collectionEndpoint,
			params: this.allColSearchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.collections = resp.collections;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.loadingMore = false;
			});
	};
	$scope.SearchCollection = (rpp: number, page: number) => {
		$scope.productsLoading = true;
		$scope.searchParams.rpp = rpp;
		$scope.searchParams.page = page || 1;
		$scope.searchParams['searchFields[]'] = ['description', 'sku'];
		const req = {
			method: 'GET',
			url: $scope.collectionEndpoint + $scope.selectedCollection.id,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					$scope.selectedCollection = resp.collection;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				$scope.productsLoading = false;
			});
	};
	$scope.AddCollection = (id: number | null) => {
		// If id is null, we are adding new collection
		$scope.loading = true;
		const updateParams: any = {
			products: [],
			categories: [],
		};
		let error = false;
		let req: any = {};
		if (id) {
			updateParams.name = $scope.selectedCollection.name;
			updateParams.image = $scope.selectedCollection.img_url;
			updateParams.description = $scope.selectedCollection.description;
			updateParams.products = $scope.editedProducts.map(
				(product: any) => product.value.product_id
			);
			updateParams.categories = $scope.editedCategories.map(
				(category: any) => category.value.cat_id
			);
			req = {
				method: 'PUT',
				url: $scope.collectionEndpoint + id,
				data: updateParams,
			};
		} else if (
			$scope.addParams.name &&
			($scope.addParams.products.length ||
				$scope.addParams.categories.length)
		) {
			for (let i = 0; i < $scope.addParams.products.length; i++) {
				updateParams.products.push(
					$scope.addParams.products[i].value.product_id
				);
			}
			for (let j = 0; j < $scope.addParams.categories.length; j++) {
				updateParams.categories.push(
					$scope.addParams.categories[j].value.cat_id
				);
			}
			updateParams.name = $scope.addParams.name;
			updateParams.description = $scope.addParams.description;
			updateParams.image = $scope.addParams.img_url;
			req = {
				method: 'POST',
				url: $scope.collectionEndpoint,
				data: updateParams,
			};
		} else {
			error = true;
		}
		if (!error) {
			Utils.getHttpPromise(req)
				.then(
					(resp: any) => {
						if (!resp.errors.length) {
							if (!id) {
								$scope.selectedCollection = {
									id: resp.collection_id,
									name: req.data.name,
									description: req.data.description,
								};
								$scope.addParams = {
									products: [],
									categories: [],
								};
								$scope.activeTab = 2;
							} else {
								$scope.TabChanged(2);
								$scope.showChanges = false;
								$scope.editedProducts = [];
								$scope.editedCategories = [];
							}
						}
					},
					(errResp: any) => {
						Debug.error(errResp);
					}
				)
				.finally(() => {
					$scope.loading = false;
				});
		} else {
			$scope.loading = false;
		}
	};
	$scope.DeleteCollection = (id: number) => {
		const callback = {
			confirm() {
				$scope.loading = true;
				const req = {
					method: 'DELETE',
					url: $scope.collectionEndpoint + id,
				};
				Utils.getHttpPromise(req).then(
					() => {
						$scope.activeTab = 0;
						$scope.selectedCollection = null;
					},
					(errResp: any) => {
						Debug.error(errResp);
					}
				);
			},
			cancel() {},
		};
		$scope.confirm.Show(
			callback,
			'Delete Collection?',
			'This will delete your collection and any products associated with it.',
			'Back',
			'DELETE'
		);
	};
	$scope.ShowChanges = () => {
		$scope.showChanges = !$scope.showChanges;
	};
	$scope.ChangeView = () => {
		$scope.viewProducts = !$scope.viewProducts;
	};
	$scope.OpenMediaFrame = (image: string) => {
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
		fileFrame.on('select', () => {
			$scope.$apply(() => {
				$scope.attachment = fileFrame
					.state()
					.get('selection')
					.first()
					.toJSON();
				$scope.removingImage = true;
				if (image === 'add_img') {
					$scope.addParams.img_url = $scope.attachment.url;
				} else if (image === 'update_img') {
					$scope.selectedCollection.img_url = $scope.attachment.url;
				}
			});
		});
		fileFrame.open();
	};
}
