import type { Localized } from '../types';
declare const localized: Localized;

const template = `
	<form role="search"
		ng-submit="$ctrl.onSubmit()"
        ng-if="!$ctrl.isPunchoutOnly">
		<div id="search-bar" class="input-group">
			<label class="sr-only" for="topNavSearch">Search products</label>
			<input id="topNavSearch" type="search" class="form-control" placeholder="Search products..." aria-label="Search products..." aria-describedby="button-search" tabindex="0"
				ng-model="$ctrl.query"
				ng-model-options="{ debounce: 300 }"
				ng-change="$ctrl.onChange()"
				ng-minlength="2">
			<div class="input-group-append">
				<button type="submit" id="button-search"
					ng-class="['btn', $ctrl.btnClass]">
				<i class="bi bi-search"
					ng-hide="$ctrl.isInProgress"></i>
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
					ng-show="$ctrl.isInProgress"></span>
				<span class="d-none d-md-inline">Search</span>
				</button>
			</div>
		</div>
	</form>
	`;

export const SearchBar: ng.IComponentOptions = {
	bindings: {
		btnClass: '@',
	},
	controller,
	template,
};

controller.$inject = ['Products', 'User', 'Utils'];

function controller(Products, User, Utils) {
	const vm = this;

	this.$onInit = () => {
		vm.catalogUrl = Utils.getPageUrl('catalog');
		vm.isPunchoutOnly = User.punchoutOnly && !User.mixedPunchout;
		vm.productSlug = localized.settings.general.product_slug || 'products';
		vm.query = '';
		initPopover();
	};

	const initPopover = () => {
		jQuery(() => {
			vm.el = jQuery('#search-bar');

			vm.el.on('hidden.bs.popover', () => {
				vm.el.popover('dispose');
			});
		});
	};

	const getProducts = () => {
		vm.el.popover('hide');
		const params = {
			q: vm.query,
		};

		if (vm.query.length >= 2) {
			vm.isInProgress = true;

			Products.list(params)
				.then((response) => response.data)
				.then((data) => {
					vm.results = processResults(data.product_briefs);
					vm.el
						.popover({
							content: getPopoverContent(),
							html: true,
							placement: 'bottom',
							template:
								'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body p-0"></div></div>',
							title: getPopoverTitle(),
						})
						.popover('show');
					vm.isInProgress = false;
				});
		}
	};

	const getPopoverContent = (): string => {
		const limit = 5;
		let content = '<div class="list-group list-group-flush">';
		vm.results.forEach((result, i) => {
			if (i < limit) {
				content =
					content +
					`
						<a href="${result.url}" class="list-group-item list-group-item-action p-2">
							<div class="form-row">
								<div class="col-2">
									<div class="embed-responsive embed-responsive-1by1">
										<img class="embed-responsive-item" src="${result.imageUrl}" alt="${result.name}" style="object-fit:contain">
									</div>
								</div>
								<div class="col-10">
									<p class="text-truncate mb-0">${result.name}</p>
									<small>$${result.price}${result.uom}</small>
								</div>
							</div>
						</a>
					`;
			}
		});
		content = content + '</div>';
		content =
			content +
			`<a class="btn btn-link btn-sm btn-block" href="${vm.catalogUrl}?q=${vm.query}">See all results</a>`;
		return content;
	};

	const getPopoverTitle = (): string => {
		return `Results for ${vm.query}:`;
	};

	this.onChange = () => {
		getProducts();
	};

	const processResults = (data) => {
		const products = data.map((product) => {
			return {
				url: `/${vm.productSlug}/${product.slug}`,
				name: product.description,
				price: new Intl.NumberFormat().format(product.price),
				sku: product.sku,
				uom: product.uom ? `/${product.uom}` : '',
				imageUrl: getProductImage(product.images),
			};
		});
		return products;
	};

	const getProductImage = (images): string => {
		// eslint-disable-next-line space-unary-ops
		if (!images || images.length === 0) {
			return '/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
		}
		return Object.values(images)[0].thumb_url;
	};

	this.onSubmit = () => {
		const page = vm.query
			? `${vm.catalogUrl}?q=${vm.query}`
			: vm.catalogUrl;
		Utils.goToPage(page);
	};
}
