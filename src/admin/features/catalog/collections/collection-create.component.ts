import angular from 'angular';
import template from './collection-create.component.html';
import { Collection } from '../../../catalog/collections/Collection';
import { apiURL } from '../../../data/apiURL';
import breadcrumbs from './breadcrumbs.json';

enum SearchTypes {
	Categories = 'CATEGORIES',
	Products = 'PRODUCTS',
}

declare const wp: any;

export const CollectionCreate: ng.IComponentOptions = {
	template,
	controller,
};

controller.$inject = ['$http', '$scope', '$state', 'SearchModal'];

function controller(
	$http: ng.IHttpService,
	$scope: ng.IScope,
	$state: ng.ui.IStateService,
	SearchModal: any
) {
	this.breadcrumbs = [
		...breadcrumbs,
		{
			label: 'Add new',
			href: '?page=vendorfuel#!/catalog/collections/create',
		},
	];
	this.collection = new Collection();
	this.searchType = SearchTypes.Products;

	this.searchResults = (results) => {
		switch (this.searchType) {
			case SearchTypes.Products:
				this.collection.products = results;
				break;
			case SearchTypes.Categories:
				this.collection.categories = results;
				break;
		}
	};

	this.openSearchModalAdd = () => {
		this.searchType = SearchTypes.Products;
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: apiURL.PRODUCTS,
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
			updatedItems: this.collection.products,
		};
		callback = {
			confirm: this.searchResults,
			cancel: angular.noop,
		};
		SearchModal.Show(
			callback,
			this.collection.name || 'New Collection',
			data,
			'Add Products'
		);
	};

	this.openSearchModalCategoryAdd = () => {
		this.searchType = SearchTypes.Categories;
		let callback = {};
		const data = {
			tabs: [
				{
					http: {
						method: 'GET',
						url: apiURL.CATEGORIES,
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
			updatedItems: this.collection.categories,
		};
		callback = {
			confirm: this.searchResults,
			cancel: angular.noop,
		};
		SearchModal.Show(
			callback,
			this.collection.name || 'New Collection',
			data,
			'Add Categories'
		);
	};

	this.handleSubmit = (collection: Collection) => {
		store(collection);
	};

	const store = (collection: Collection) => {
		this.isBusy = true;
		const url = apiURL.COLLECTIONS;
		const data: Collection = {
			name: collection.name,
			description: collection.description,
			image: collection.image,
			products: collection.products?.map(
				(product) => product.value.product_id
			),
			categories: collection.categories?.map(
				(category) => category.value.cat_id
			),
		};
		$http
			.post(url, data)
			.then((response) => {
				if (response?.data?.collection_id) {
					$state.go('catalog.collections.edit', {
						id: response.data.collection_id,
					});
				}
			})
			.finally(() => {
				this.isBusy = false;
			});
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
