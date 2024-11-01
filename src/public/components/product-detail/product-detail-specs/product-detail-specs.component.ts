import angular from 'angular';
import template from './product-detail-specs.component.html';

/**
 * Product Detail Specs Component
 *
 * @namespace Components
 */
(function () {
	'use strict';

	angular.module('vfApp').component('productDetailSpecs', {
		bindings: {
			product: '<',
			breadcrumb: '<',
		},
		controller: SpecsController,
		template,
	});

	SpecsController.$inject = ['Utils'];

	/**
	 * @param {Object} Utils VendorFuel service.
	 */
	function SpecsController(Utils) {
		const urlBase = Utils.getPageUrl('catalog');
		const vm = this;
		vm.$onInit = onInit;

		/**
		 * @name $onInit
		 * @memberof Components.SpecsController
		 */
		function onInit() {
			vm.breadcrumb = getBreadcrumb(vm.product);
			vm.specs = getSpecs(vm.product);
		}

		/**
		 * @param {Object} product Product
		 * @return {Object} Category breadcrumb.
		 */
		function getBreadcrumb(product) {
			return product.category_breadcrumb;
		}

		/**
		 * @param {Array} breadcrumb Breadcrumb
		 * @return {Object} Last category.
		 */
		function getLastCategory(breadcrumb) {
			if (breadcrumb) {
				return Object.values(breadcrumb).pop();
			}
		}

		/**
		 * @param {Object} product Product data.
		 * @return {Array} Product specs.
		 */
		function getSpecs(product) {
			const specs = [
				{
					label: 'SKU',
					title: 'Stock Keeping Unit',
					values: [
						{
							name: product.sku,
							url: `${urlBase}?q=${product.sku}`,
						},
					],
				},
				{
					label: 'Manufacturer',
					values: product.manufacturer
						? [
								{
									name: product.manufacturer,
									url: `${urlBase}?manufacturer=${product.manufacturer}`,
								},
						  ]
						: null,
				},
				{
					label: 'MFR Part Number',
					title: 'Manufacturer Part Number',
					values: product.mfg_part_num
						? [{ name: product.mfg_part_num }]
						: null,
				},
				{
					label: 'Includes',
					values: product.includes
						? [{ name: product.includes }]
						: null,
				},
				{
					label: 'UPC',
					title: 'Universal Product Code',
					values: product.upc ? [{ name: product.upc }] : null,
				},
				{
					label: 'Family',
					values: product.family
						? [
								{
									name: product.family,
									url: `${urlBase}?q=${product.family}`,
								},
						  ]
						: null,
				},
				{
					label: 'PCRC',
					title: 'Post Consumer Recycled Content',
					values: product.pcrc
						? [
								{
									name: Number(product.pcrc.percentage),
									url: `${urlBase}?recycled`,
								},
						  ]
						: null,
				},
			];

			for (const [key, value] of Object.entries(product.attributes)) {
				if (value) {
					specs.push({
						label: key,
						values: getAttributeValues(key, value),
					});
				}
			}
			return specs.filter((element) => element.values);
		}

		/**
		 * @param {string} key   Key
		 * @param {Array}  value Value
		 * @return {Array} Attribute values.
		 */
		function getAttributeValues(key, value) {
			const values = [];
			const lastCategory = getLastCategory(vm.breadcrumb);
			if (Array.isArray(value)) {
				value.forEach((element) => {
					values.push({
						name: element,
						url: lastCategory
							? getAttributeUrl(key, element, lastCategory)
							: null,
						title: lastCategory
							? `View other items with similar ${key} in ${lastCategory.title}.`
							: null,
					});
				});
			} else {
				values.push({
					name: value,
					url: lastCategory
						? getAttributeUrl(key, value, lastCategory)
						: null,
					title: lastCategory
						? `View other items with similar ${key} in ${lastCategory.title}.`
						: null,
				});
			}
			return values;
		}

		/**
		 * @param {string} key          Attribute key
		 * @param {string} value        Attribute value
		 * @param {Object} lastCategory Last category
		 * @return {string} URL
		 */
		function getAttributeUrl(key, value, lastCategory) {
			const catSlug = localized.settings.general.catSlug || 'categories';
			const path = `/${catSlug}/${lastCategory.slug}`;
			const min = 1;
			const max = 30;
			if (value.length > min && value.length < max) {
				return `${path}?attr:${encodeURIComponent(
					key
				)}=${encodeURIComponent(value)}&available_stock=false`;
			}
		}
	}
})();
