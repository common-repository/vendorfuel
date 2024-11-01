import template from './search-bar.component.html';
import type { Popover } from 'bootstrap';
import type { Localized } from '../../types';
import * as bootstrap from 'bootstrap';

declare const localized: Localized;

export const SearchBar: ng.IComponentOptions = {
	bindings: {
		btnClass: '@',
	},
	controller: class Controller {
		static $inject = ['$http', '$scope'];

		isBusy: boolean = false;
		popover: Popover;
		products: any;
		productSlug: string =
			localized.settings.general.product_slug || 'products';
		q: string;
		shown: boolean = false;
		trigger: HTMLElement;

		// eslint-disable-next-line no-useless-constructor
		constructor(
			private $http: ng.IHttpService,
			private $scope: ng.IScope
		) {}

		$onInit() {
			this.popover = new bootstrap.Popover(
				document.querySelector('#search-bar'),
				{
					container: 'body',
					placement: 'bottom',
					content: '',
					html: true,
					trigger: 'manual',
				}
			);

			this.trigger = document.querySelector('#search-bar');
			this.trigger.addEventListener('hidden.bs.popover', () => {
				this.$scope.$apply(() => {
					this.shown = false;
				});
			});
			this.trigger.addEventListener('shown.bs.popover', () => {
				this.$scope.$apply(() => {
					this.shown = true;
				});
			});
		}

		handleBlur() {
			this.popover.hide();
		}

		handleChange(q: string) {
			this.popover.hide();
			if (q.length > 2) {
				const url = `${localized.apiURL}/catalog/search/new`;
				const config = {
					params: {
						q,
						rpp: 5,
					},
				};
				this.isBusy = true;
				this.$http.get(url, config).then((response) => {
					this.products = response.data.product_briefs;
					this.popover.setContent({
						'.popover-header': `Results for '${this.q}':`,
						'.popover-body': this.popoverBody(this.products),
					});
					if (this.products.length && !this.shown) {
						this.popover.show();
					}
					this.isBusy = false;
				});
			}
		}

		handleFocus() {
			if (!this.shown && this.products?.length) {
				this.popover.show();
			}
		}

		handleSubmit(q?: string) {
			let params = '';
			if (q) {
				params = `?${new URLSearchParams({ q }).toString()}`;
			}
			const url = new URL(`${localized.pages.catalog.url}${params}`);
			location.assign(url);
		}

		popoverBody(
			products: {
				price: number;
				description: string;
				slug: string;
			}[]
		) {
			let body = '<div class="list-group list-group-flush">';
			products.forEach((product) => {
				body =
					body +
					`<a class="list-group-item" href="/${this.productSlug}/${
						product.slug
					}" tabindex="0">
						<div class="text-truncate">${product.description}	</div>
						<small>${new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(product.price)}</small>
					</a>`;
			});

			body = body + `</div>`;
			return body;
		}
	},
	template,
};
