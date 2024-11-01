import template from './product-specs.component.html';

export const ProductSpecs: ng.IComponentOptions = {
	bindings: {
		product: '<',
		breadcrumb: '<',
	},
	controller,
	template,
};

controller.$inject = ['Utils'];

function controller(Utils) {
	const urlBase = Utils.getPageUrl('catalog');
	const vm = this;
	vm.$onInit = onInit;

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
						href: `${urlBase}?q=${product.sku}`,
					},
				],
			},
			{
				label: 'Manufacturer',
				values: product.manufacturer
					? [
							{
								name: product.manufacturer,
								href: `${urlBase}?manufacturer=${product.manufacturer}`,
							},
					  ]
					: null,
			},
			{
				label: 'Manufacturer part number',
				values: product.mfg_part_num
					? [
							{
								name: product.mfg_part_num,
								href: `${urlBase}?q=${product.mfg_part_num}`,
							},
					  ]
					: null,
			},
			{
				label: 'Includes',
				values: product.includes ? [{ name: product.includes }] : null,
			},
			{
				label: 'UPC',
				title: 'Universal Product Code',
				values: product.upc ? [{ name: product.upc }] : null,
			},
			{
				label: 'Family/series of related products',
				values: product.family
					? [
							{
								name: product.family,
							},
					  ]
					: null,
			},
			{
				label: 'PCRC',
				title: 'Post consumer recycled content',
				values: product.pcrc
					? [
							{
								name: Number(product.pcrc.percentage),
								href: `${urlBase}?recycled`,
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

	function getAttributeValues(key: string, value: unknown) {
		const values = [];
		if (Array.isArray(value)) {
			value.forEach((element) => {
				values.push({
					name: element,
				});
			});
		} else {
			values.push({
				name: value,
			});
		}
		return values;
	}
}
