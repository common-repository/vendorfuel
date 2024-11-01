import angular from 'angular';

interface Catalog {
	subcategories?: {
		img_url: string;
		results?: number;
		slug: string;
		title: string;
	}[];
	filters: {};
	currentPage: number;
	query: string;
	refinements: unknown;
	orderBy: unknown;
}

catalogService.$inject = ['$location', '$rootScope', 'Products'];

export function catalogService(
	$location: ng.ILocationService,
	$rootScope: ng.IRootScopeService,
	Products: unknown
) {
	const sortByOptions = [
		{
			name: 'Most Relevant',
			value: 'relevance',
			icon: 'bi bi-sort-down',
		},
		{
			name: 'Price Low-High',
			value: 'pricea',
			icon: 'bi bi-sort-numeric-down',
		},
		{
			name: 'Price High-Low',
			value: 'priced',
			icon: 'bi bi-sort-numeric-down-alt',
		},
		{
			name: 'Title Ascending',
			value: 'descriptiona',
			icon: 'bi bi-sort-alpha-down',
		},
		{
			name: 'Title Descending',
			value: 'descriptiond',
			icon: 'bi bi-sort-alpha-down-alt',
		},
	];

	const catalog: Catalog = {
		filters: {
			isShowingOnlyStock:
				$location.search().available_stock === true ? true : false,
			isShowingRecycled:
				$location.search().recycled === true ? true : false,
			isShowingGSA: $location.search().gsa === true ? true : false,
			isShowingCoreList:
				$location.search().core_list === true ? true : false,
			isShowingAbilityOne:
				$location.search().ability_one === true ? true : false,
		},
		currentPage: $location.search().pg ? Number($location.search().pg) : 1,
		query: $location.search().q
			? decodeURIComponent($location.search().q.replace('%', ''))
			: '',
		refinements: setRefinements(),
		orderBy: $location.search().sortby
			? sortByOptions.find(
					(element) => element.value === $location.search().sortby
			  )
			: sortByOptions[0],
	};

	return {
		getAttributes,
		getFacets,
		getBreadcrumb,
		getCategories,
		getCategoryId,
		getCatalog,
		getCurrentPage,
		getDataLength() {
			return catalog.hits.length;
		},
		getDescription,
		getFilters,
		getNumResults,
		getManufacturers,
		getParams,
		getPagination,
		getQuery,
		getRefinements,
		getSortBy,
		getSubcategories() {
			return catalog.subcategories
				? catalog.subcategories.filter((category) => category.results)
				: null;
		},
		getTitle,
		getTotalPages,
		changeCurrentPage,
		changeRefinement,
		changeSortBy,
		changeQuery,
		clearRefinements,
		searchFacets,
		setCatalogId,
	};

	/**
	 * @return {Object} Catalog
	 */
	function getCatalog() {
		const params = getParams();

		return Products.list(params)
			.then((resolve) => resolve.data)
			.then((data) => {
				catalog.attributes = setAttributes(data.attributes);
				catalog.brands = setFacetValues(
					data.facets.brand_name,
					'brand_name'
				);
				catalog.manufacturers = setFacetValues(
					data.facets.manufacturer,
					'manufacturer'
				);
				catalog.breadcrumb = data
					? setBreadcrumb(data.category_hierarchy)
					: null;
				catalog.category = data.category ? data.category : null;
				catalog.categories = data ? setCategories(data) : null;
				catalog.collection = data.collection ? data.collection : null;
				catalog.currentPage = data.currentPage ? data.currentPage : 1;
				catalog.description = data.category
					? data.category.description
					: null;
				catalog.filters = setFilters(data.filters);
				catalog.hits = data.product_briefs ? data.product_briefs : null;
				catalog.numResults = data.num_results ? data.num_results : 0;
				catalog.pagination = setPagination(data);
				catalog.title = setTitle(catalog);
				catalog.totalPages = data.totalPages ? data.totalPages : 1;
				catalog.errors = data.errors;
				setSubcategories(data.sub_categories);
				return catalog;
			})
			.catch((reject) => {
				console.error(reject);
			});
	}

	/**
	 * @name getParams
	 * @return {Object} Params for Products.list().
	 */
	function getParams() {
		const search = $location.search();

		const params = {
			ability_one: search.ability_one,
			available_stock: search.available_stock,
			cat: getCategoryId(),
			collection: getCollectionId(),
			core_list: search.core_list,
			facetFilters: getFacetFilters(),
			gsa: search.gsa,
			mfg: getManufacturerId(),
			page: search.pg ? Number(search.pg) : 1,
			rpp: 32,
			pcrc: search.recycled || search.recycled === true ? true : false,
			q: search.q,
			sortby: getSortBy().value,
		};
		return params;
	}

	/**
	 * @param {number} page Page number.
	 */
	function changeCurrentPage(page) {
		catalog.currentPage = page ? Number(page) : 1;
		$rootScope.$emit('catalog.params:changes', 'Update the catalog.');
	}

	/**
	 * @param {string} query Query string.
	 */
	function changeQuery(query) {
		catalog.query = query;
		$rootScope.$emit('catalog.params:changes', 'Update the catalog.');
	}

	/**
	 * @function changeRefinement
	 * @param {Object} refinement Refinement
	 */
	function changeRefinement(refinement) {
		if (refinement.value === true) {
			if (
				!catalog.refinements.some(
					(item) =>
						item.facet === refinement.facet &&
						item.key === refinement.key
				)
			) {
				catalog.currentPage = 1;
				catalog.refinements.push(refinement);
			}
		} else {
			const refinementsIdx = catalog.refinements.findIndex(
				(item) =>
					item.facet === refinement.facet &&
					item.key === refinement.key
			);
			if (refinementsIdx >= 0) {
				catalog.refinements.splice(refinementsIdx, 1);
			}

			/* Uncheck any brand or mfr that's been selected */
			const brandsIdx = catalog.brands.findIndex(
				(item) => item.key === refinement.key
			);
			if (brandsIdx >= 0) {
				catalog.brands[brandsIdx].value.checked = false;
			}

			const mfrsIdx = catalog.manufacturers.findIndex(
				(item) => item.key === refinement.key
			);
			if (mfrsIdx >= 0) {
				catalog.manufacturers[mfrsIdx].value.checked = false;
			}

			if (
				refinement.facet !== 'Brand' &&
				refinement.facet !== 'Manufacturer'
			) {
				const facetIdx = catalog.attributes.findIndex(
					(attribute) => attribute.facet === refinement.facet
				);
				if (facetIdx >= 0) {
					const attrIdx = catalog.attributes[
						facetIdx
					].values.findIndex((item) => item.key === refinement.key);
					catalog.attributes[facetIdx].values[attrIdx].value.checked =
						false;
				}
			}
		}
	}

	/**
	 * @param {string} orderBy Sorting
	 */
	function changeSortBy(orderBy) {
		catalog.orderBy = orderBy;
		$rootScope.$emit('catalog.params:changes', 'Update the catalog.');
	}

	/**
	 * @function clearRefinements
	 * @description Clears all catalog refinements, triggering catalog refresh.
	 */
	function clearRefinements() {
		catalog.refinements = [];
		$location.search('brand_name', null);
		$location.search('manufacturer', null);
		$rootScope.$emit('catalog.params:changes', 'Update the catalog.');
	}

	/**
	 * @return {Array} Attributes.
	 */
	function getAttributes() {
		return catalog.attributes;
	}

	/**
	 * @return {Object} Breadcrumb.
	 */
	function getBreadcrumb() {
		return catalog.breadcrumb;
	}

	/**
	 * @param {string} key Facet key.
	 * @return {Array} Facets.
	 */
	function getFacets(key) {
		if (key === 'brand_name') {
			return catalog.brands;
		} else if (key === 'manufacturer') {
			return catalog.manufacturers;
		}
	}

	/**
	 * @return {number} Category ID.
	 */
	function getCategoryId() {
		if (location.pathname === '/catalog/') {
			return $location.search().category
				? Number($location.search().category)
				: null;
		}
		return catalog.categoryId;
	}

	/**
	 * @return {number} Collection ID.
	 */
	function getCollectionId() {
		if ($location.path().includes('catalog')) {
			return $location.search().collection
				? Number($location.search().collection)
				: null;
		}
		return catalog.collectionId;
	}

	/**
	 * @return {number} Manufacturer ID.
	 */
	function getManufacturerId() {
		if ($location.path().includes('catalog')) {
			return $location.search().mfg
				? Number($location.search().mfg)
				: null;
		}
		return catalog.mfgId;
	}

	/**
	 * @return {Array} Categories
	 */
	function getCategories() {
		return catalog.categories;
	}

	/**
	 * @return {number} Page
	 */
	function getCurrentPage() {
		return catalog.currentPage;
	}

	/**
	 * @return {string} Description
	 */
	function getDescription() {
		return catalog.description;
	}

	/**
	 * @name getFacetFilters
	 * @description Converts the refinements array into an array of facetFilters for Algolia.
	 * @return {Array} Nested array of strings formatted for Algolia.
	 * @memberof Factories.catalogService
	 */
	function getFacetFilters() {
		const facetFilters = [];
		if (getFacetFromParams('brand_name')) {
			facetFilters.push(getFacetFromParams('brand_name'));
		}
		if (getFacetFromParams('manufacturer')) {
			facetFilters.push(getFacetFromParams('manufacturer'));
		}
		return facetFilters
			.concat(getAttributeFromParams())
			.filter((element) => element.length);

		/**
		 * @name getFacetFromParams
		 * @param {string} facet Expecting 'brand_name' or 'manufacturer'.
		 * @return {(Array | null)} Array of strings formatted for Algolia.
		 */
		function getFacetFromParams(facet) {
			const paramValue = $location.search()[facet];

			if (Array.isArray(paramValue)) {
				return paramValue.map((element) => {
					return `${facet}: ${element}`;
				});
			} else if (paramValue) {
				return [`${facet}: ${paramValue}`];
			}
		}

		/**
		 * @name getAttributeFromParams
		 * @return {Array} Array of strings formatted for Algolia.
		 */
		function getAttributeFromParams() {
			const search = $location.search();
			const pattern = /attr:/i;
			const namespace = 'attr:';
			const attributes = Object.entries(search)
				.filter((element) => {
					const [key] = element;
					return pattern.test(key);
				})
				.map((element) => {
					const [key, value] = element;
					if (Array.isArray(value)) {
						return value.map((el) => {
							return `${key.replace(namespace, '')}: ${el}`;
						});
					} else if (value) {
						return `${key.replace(namespace, '')}: ${value}`;
					}
					return false;
				});
			return attributes.filter((element) => element);
		}
	}

	/**
	 * @function getFacetSearchResults
	 * @param {string} facet Facet name.
	 * @param {string} query Query to search facets for.
	 * @return {Array} Facet search results.
	 */
	function getFacetSearchResults(facet, query) {
		const params = {
			cat: catalog.categoryId,
			facetName: facet ? facet : '',
			facetQuery: query ? query : '',
			q: '',
		};

		return Products.list(params).then(function (response) {
			return response.data.facet_search_results;
		});
	}

	/**
	 * @return {Array} Catalog filters.
	 */
	function getFilters() {
		return catalog.filters;
	}

	/**
	 * @return {string} Query.
	 */
	function getQuery() {
		return catalog.query;
	}

	/**
	 * @return {Array} Manufacturers.
	 */
	function getManufacturers() {
		return catalog.manufacturers;
	}

	/**
	 * @return {number} Catalog results.
	 */
	function getNumResults() {
		return catalog.numResults;
	}

	/**
	 * @return {Object} Pagination.
	 */
	function getPagination() {
		return catalog.pagination;
	}

	/**
	 * @return {Array} Refinements
	 */
	function getRefinements() {
		return catalog.refinements;
	}

	/**
	 * @return {string} Sort by.
	 */
	function getSortBy() {
		return catalog.orderBy;
	}

	/**
	 * @return {string} Title.
	 */
	function getTitle() {
		return catalog.title;
	}

	/**
	 * @return {number} Total pages.
	 */
	function getTotalPages() {
		return catalog.totalPages;
	}

	/**
	 * @function searchFacets
	 * @param {string} query Query string.
	 * @param {string} facet Expects 'brand_name' or 'manufacturer'
	 * @return {Array} Facet search results.
	 */
	function searchFacets(query, facet) {
		if (query !== '') {
			query = query.replace(/[^0-9A-z\s]/gi, ' ');
			return getFacetSearchResults(facet, query).then(function (
				searchResults
			) {
				if (facet === 'brand_name') {
					if (searchResults.length > 0) {
						const brands = [];
						for (const result of searchResults) {
							brands.push({
								facet: 'Brand',
								key: result.value,
								value: {
									results: result.count,
									highlighted: result.highlighted,
									checked: getRefinements().find(
										(item) => item.key === result.value
									)
										? true
										: false,
								},
							});
						}
						catalog.brands = brands;
					}
				} else if (facet === 'manufacturer') {
					if (searchResults.length > 0) {
						const manufacturers = [];
						for (const result of searchResults) {
							manufacturers.push({
								facet: 'Manufacturer',
								key: result.value,
								value: {
									results: result.count,
									highlighted: result.highlighted,
									checked: getRefinements().find(
										(item) => item.key === result.value
									)
										? true
										: false,
								},
							});
						}
						catalog.manufacturers = manufacturers;
					}
				}
				$rootScope.$emit('catalog:facetSearched', {
					facet,
					results: searchResults.length,
				});
			});
		}
	}

	/**
	 * @name setAttributes
	 * @param {(Object | Array)} data Attributes object or empty array.
	 * @return {Array} Attributes in an array with all the necessary properties.
	 */
	function setAttributes(data) {
		if (data) {
			const attributes = Object.entries(data).map((element) => {
				const [key, values] = element;
				const attribute = {
					key,
					values: [],
				};

				Object.entries(values).forEach((el) => {
					const [k, results] = el;
					attribute.values.push({
						value: k,
						results,
						isChecked: isAttrValueChecked(attribute.key, k),
					});
				});

				return attribute;
			});

			return attributes;
		}

		/**
		 * @param {string} key   Attribute key
		 * @param {string} value Attribute value.
		 * @return {boolean} Returns if attribute value is checked or not.
		 */
		function isAttrValueChecked(key, value) {
			const namespacedKey = `attr:${key}`;
			const search = $location.search()[namespacedKey];

			if (Array.isArray(search)) {
				return search.includes(value);
			} else if (search) {
				return search === value;
			}
			return false;
		}
	}

	/**
	 * @param {Object} data      Facet data.
	 * @param {string} facetName Facet name.
	 * @return {Array} Values
	 */
	function setFacetValues(data, facetName) {
		if (data) {
			const values = Object.entries(data).map((element) => {
				const [value, results] = element;
				return {
					value,
					results,
					isChecked: isAttrValueChecked(value),
				};
			});
			return values;
		}

		/**
		 * @param {string} value Attribute value.
		 * @return {boolean} Returns if attribute value is checked or not.
		 */
		function isAttrValueChecked(value) {
			const search = $location.search()[facetName];
			if (Array.isArray(search)) {
				return search.includes(value);
			} else if (search) {
				return search === value;
			}
			return false;
		}
	}

	/**
	 * @param {Object} hierarchy Category hierarchy
	 * @return {Array} List of breadcrumbs.
	 */
	function setBreadcrumb(hierarchy) {
		const list = [];
		if (hierarchy) {
			for (const item of hierarchy) {
				list.push({
					title: item.title,
					link: `/categories/${item.slug}`,
				});
			}
		}
		return list;
	}

	/**
	 * @function setCatalogId
	 * @param {number} id   ID
	 * @param {string} type Expects 'CATEGORY', 'COLLECTION' or 'MANUFACTURER'
	 */
	function setCatalogId(id, type) {
		/* Convert old WP reserved 'cat' query param to newer 'category'. */
		if ($location.search().cat) {
			const catId = $location.search().cat;
			$location.search('category', catId);
			$location.search('cat', null);
		}

		if (location.pathname === '/catalog/') {
			catalog.categoryId = $location.search().category
				? Number($location.search().category)
				: null;
			catalog.collectionId = $location.search().collection
				? Number($location.search().collection)
				: null;
			catalog.mfgId = $location.search().mfg
				? Number($location.search().mfg)
				: null;
		} else if (id) {
			catalog.categoryId = type === 'CATEGORY' ? id : null;
			catalog.collectionId = type === 'COLLECTION' ? id : null;
			catalog.mfgId = type === 'MANUFACTURER' ? Number(id) : null;
		}
	}

	/**
	 * @param {Object} data Catalog data.
	 * @description Sets the catagories and subcategories, if any.
	 * @return {Array} Categories
	 */
	function setCategories(data) {
		const facets = data.facets;
		const categories = data.main_categories || [];

		/* Get the results for each main category. */
		for (const category of categories) {
			if (
				facets['categories.lvl0'] &&
				facets['categories.lvl0'][category.title]
			) {
				category.results = facets['categories.lvl0'][category.title];
			} else {
				category.results = 0;
			}
		}

		/* If on a category page, set the active category and build out the subcategories array */
		if (data.category) {
			const mainCategory = data.category_hierarchy[0];
			const activeCatIndex = categories.findIndex(
				(category) => category.title === mainCategory.title
			);

			if (activeCatIndex > -1) {
				const tree = data.category_hierarchy;
				categories[activeCatIndex].tree = tree;
				categories[activeCatIndex].active = true;
				categories[activeCatIndex].subcategories = data.sub_categories;
			}
		}
		return categories;
	}

	/**
	 * @param {Object} filters Filters returned from API response
	 * @return {Object} Filters
	 */
	function setFilters(filters) {
		return {
			isShowingOnlyStock:
				filters && filters.available_stock ? true : false,
			isShowingRecycled: filters && filters.recycled ? true : false,
			isShowingGSA: filters && filters.gsa ? true : false,
			isShowingCoreList: filters && filters.core_list ? true : false,
			isShowingAbilityOne: filters && filters.ability_one ? true : false,
		};
	}

	/**
	 * @param {Object} data Catalog data.
	 * @return {Array} Pagination.
	 */
	function setPagination(data) {
		const pagination = [];
		const totalPages = data.totalPages;
		for (let index = 1; index <= totalPages; index++) {
			pagination.push(index);
		}
		return pagination;
	}

	/**
	 * @return {Array} Refinements
	 */
	function setRefinements() {
		const refinements = [];
		const brandParams = $location.search().brand_name
			? [$location.search().brand_name].flat()
			: null;
		const mfrParams = $location.search().manufacturer
			? [$location.search().manufacturer].flat()
			: null;

		angular.forEach(brandParams, function (brand) {
			refinements.push({
				facet: 'Brand',
				key: decodeURIComponent(brand),
			});
		});
		angular.forEach(mfrParams, function (mfr) {
			refinements.push({
				facet: 'Manufacturer',
				key: decodeURIComponent(mfr),
			});
		});
		return refinements;
	}

	function setSubcategories(subcategories) {
		if (subcategories.length) {
			catalog.subcategories = subcategories;
		}
	}

	/**
	 * @function setTitle
	 * @param {Object} cat Catalog
	 * @return {string} Title
	 */
	function setTitle(cat) {
		if (cat.category) {
			return cat.category.title;
		} else if (cat.collection) {
			return cat.collection.name;
		} else if (cat.mfg) {
			return cat.mfg.name;
		}
		return 'Catalog';
	}
}
