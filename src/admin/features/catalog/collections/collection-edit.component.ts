import template from './collection-edit.component.html';
import type { Localized } from '../../../types';
import { Collection } from '../../../catalog/collections/Collection';
import { apiURL } from '../../../data/apiURL';
import breadcrumbs from './breadcrumbs.json';

declare const localized: Localized;
declare const wp: any;

export const CollectionEdit: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = [
	'$http',
	'$scope',
	'$state',
	'$stateParams',
	'Admin',
	'Debug',
	'Utils',
	'SearchModal',
];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	$stateParams: ng.ui.IStateParamsService,
	Admin: any,
	Debug: any,
	Utils: any,
	SearchModal: any
) {
	this.breadcrumbs = breadcrumbs;
	this.collection = new Collection();

	this.$onInit = () => {
		$scope.categoryEndpoint = localized.apiURL + '/admin/category/';
		$scope.collectionEndpoint =
			localized.apiURL + '/admin/product/collection/';
		$scope.editedCategories = [];
		$scope.editedProducts = [];
		$scope.editName = false;
		$scope.isAuthed = Admin.Authed();
		$scope.loadingMore = false;
		$scope.productEndpoint = localized.apiURL + '/admin/products/';
		$scope.object = Object;
		$scope.saved = false;
		$scope.saving = false;
		$scope.searchParams = {};
		$scope.searchTerm = '';
		$scope.searchTypes = {
			PRODUCTS: 'PRODUCTS',
			CATEGORIES: 'CATEGORIES',
		};
		$scope.searchType = $scope.searchTypes.PRODUCTS; // Must be defined after searchTypes declaration.
		$scope.showChanges = false;

		this.allColSearchParams = {
			q: '',
			orderBy: '',
			direction: '',
		};
		this.sortAscending = true;

		$scope.saving = false;
		$scope.saved = false;
		$scope.cancelled = false;
		show($stateParams.id);
	};

	$scope.SearchResults = (resp: any) => {
		switch ($scope.searchType) {
			case $scope.searchTypes.PRODUCTS:
				$scope.editedProducts = resp;
				break;
			case $scope.searchTypes.CATEGORIES:
				$scope.editedCategories = resp;
				break;
		}
	};
	$scope.SearchCancelled = () => {
		//callback that is used by the search modal
	};

	const show = (id: number) => {
		this.isBusy = true;
		const url = `${apiURL.COLLECTIONS}/${id}`;
		$http
			.get(url)
			.then((response) => response.data)
			.then((data) => {
				this.collection = data.collection;
				this.breadcrumbs = [
					...breadcrumbs,
					{
						label: data.collection.name,
						href: `?page=vendorfuel#!/catalog/collections/${data.collection.id}`,
					},
				];
			})
			.finally(() => {
				this.hasResolved = true;
				this.isBusy = false;
			});
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
							excludedId: this.collection.id,
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
						url: $scope.collectionEndpoint + this.collection.id,
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
		SearchModal.Show(callback, this.collection.name, data, 'Add Products');
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
							excludedId: this.collection.id,
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
						url: $scope.collectionEndpoint + this.collection.id,
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
			this.collection.name,
			data,
			'Add Categories'
		);
	};

	$scope.SearchCollection = (page: number) => {
		this.isBusy = true;
		$scope.searchParams.page = page || 1;
		$scope.searchParams['searchFields[]'] = ['description', 'sku'];
		const req = {
			method: 'GET',
			url: $scope.collectionEndpoint + this.collection.id,
			params: $scope.searchParams,
		};
		Utils.getHttpPromise(req)
			.then(
				(resp: any) => {
					this.collection = resp.collection;
				},
				(errResp: Error) => {
					Debug.error(errResp);
				}
			)
			.finally(() => {
				this.isBusy = false;
			});
	};

	this.handleDelete = () => {
		if (window.confirm('Delete this collection?')) {
			destroy(this.collection.id);
		}
	};

	this.handleSubmit = (collection: Collection) => {
		update(collection);
	};

	const destroy = (id: number) => {
		const url = `${apiURL.COLLECTIONS}/${id}`;
		$http.delete(url).then((response) => {
			if (!response.data.errors.length) {
				$state.go('catalog.collections.index');
			}
		});
	};

	const update = (collection: Collection) => {
		const url = `${apiURL.COLLECTIONS}/${collection.id}`;
		const data: Collection = {
			name: collection.name,
			description: collection.description,
			image: collection.image,
			products: $scope.editedProducts.map(
				(product) => product.value.product_id
			),
			categories: $scope.editedCategories.map(
				(category) => category.value.cat_id
			),
		};

		$http.put(url, data).then((response) => {
			if (!response.data.errors.length) {
				// Must refetch data due to structural mismatch from API.
				const id = response.data.collection.id;
				show(id);
				$scope.showChanges = false;
				$scope.editedProducts = [];
				$scope.editedCategories = [];
			}
		});
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
						$state.go('catalog.collections.index');
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

	this.openMediaFrame = () => {
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
				const attachment = fileFrame
					.state()
					.get('selection')
					.first()
					.toJSON();
				this.collection.image = attachment.url;
			});
		});
		fileFrame.open();
	};
}
