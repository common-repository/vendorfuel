import { debug } from '../../../shared/debug';
import { Rate } from './Rate';
import template from './template.html';

export const FlatRatesPage: ng.IComponentOptions = {
	controller: class Controller {
		static $inject = ['$http', '$stateParams'];
		baseURL: string;
		breadcrumbs: { label: string; href: string }[];
		activeTab: number;
		del: number;
		loading: boolean;
		rate: Rate;
		rppValues: number[];
		searchParams: {
			page?: number;
			q: string;
			orderBy: string;
			direction: string;
			rpp: number;
		};
		rates: { data: Rate[] };
		modifiers: any[];
		modifierLimit: number = 5;
		deleting: boolean;
		updating: boolean;
		isBusy: boolean;
		searchTerm: string;

		constructor(
			private $http: ng.IHttpService,
			private $stateParams: ng.ui.IStateParamsService
		) {
			this.activeTab = parseInt(this.$stateParams.activeTab) || 0;
			this.baseURL = `${localized.apiURL.replace(
				'v1',
				'v2'
			)}/admin/shipping/rates`;
			this.breadcrumbs = [
				{ label: 'Shipping', href: '?page=vf-shipping' },
				{
					label: 'Rates',
					href: '?page=vendorfuel#!/shipping/rates/0',
				},
			];
			this.loading = true;
			this.rate = new Rate();
			this.rppValues = [15, 30, 50, 100];
			this.searchParams = {
				q: '',
				orderBy: '',
				direction: '',
				rpp: this.rppValues[0],
			};
		}

		changeTab(tabIndex: number, flatRateIndex: number, e: Event) {
			e.preventDefault();
			this.activeTab = tabIndex;
			this.rate = this.rates.data[flatRateIndex];
		}

		create() {
			this.rate = new Rate();
			this.loading = false;
		}

		destroy() {
			this.deleting = true;
			const url = `${this.baseURL}/${this.rate.id}`;

			this.$http
				.delete(url)
				.then(() => {
					this.rate = new Rate();
					this.activeTab = 0;
				})
				.catch((error) => debug(error))
				.finally(() => (this.deleting = false));
		}

		edit() {
			this.show(this.rate.id);
		}

		handleRemove(propertyName: string, id: number) {
			const url = `${this.baseURL}/${this.rate.id}`;

			let idProperty = 'id';
			switch (propertyName) {
				case 'groups':
					idProperty = 'group_id';
					break;
				case 'price_sheets':
					idProperty = 'price_sheet_index_id';
					break;
				case 'restricted_items':
					idProperty = 'product_id';
					break;
			}

			const data = {
				[propertyName]: [
					{
						[idProperty]: id,
						deleted: true,
					},
				],
			};

			this.$http
				.patch(url, data)
				.then((response) => response.data)
				.then(() => {
					this.show(this.rate.id);
				});
		}

		handleSelect(modelName: string, modelIds: number[]) {
			const url = `${this.baseURL}/${this.rate.id}`;

			let propertyName = modelName;
			let idProperty = 'id';
			switch (modelName) {
				case 'groups':
					idProperty = 'group_id';
					break;
				case 'pricesheets':
					propertyName = 'price_sheets';
					idProperty = 'price_sheet_index_id';
					break;
				case 'products':
					propertyName = 'restricted_items';
					idProperty = 'product_id';
					break;
			}

			const data = {
				[propertyName]: modelIds.map((id) => {
					return {
						[idProperty]: id,
					};
				}),
			};

			this.$http
				.patch(url, data)
				.then((response) => response.data)
				.then(() => {
					this.show(this.rate.id);
				});
		}

		index() {
			const url = this.baseURL;
			this.$http
				.get(url)
				.then((response) => response.data)
				.then((data: { rates: { data: Rate[] } }) => {
					this.rates = data.rates;
				})
				.catch((error) => debug(error))
				.finally(() => (this.loading = false));

			debug('I am error.');
		}

		isNotApplied(): boolean {
			if (this.rate) {
				if (
					!this.rate.customers.length &&
					!this.rate.groups.length &&
					!this.rate.price_sheets.length
				) {
					return true;
				}
			}
		}

		save() {
			this.updating = true;
			const url = this.baseURL;
			const data = this.rate;

			this.$http
				.post(url, data)
				.then((response) => response.data)
				.then((responseData: { errors: string[]; rate: Rate }) => {
					if (!responseData.errors.length) {
						this.rate = responseData.rate;
						this.activeTab = 2;
					}
				})
				.catch((error) => debug(error))
				.finally(() => {
					this.updating = false;
				});
		}

		searchRates(page: number, query: string) {
			this.isBusy = true;
			this.searchParams.q = query;
			this.searchTerm = this.searchParams.q;
			this.searchParams.page = page || 1;
			const params = this.searchParams;

			const url = this.baseURL;
			this.$http
				.get(url, { params })
				.then((response) => response.data)
				.then((data: { rates: any }) => {
					this.rates = data.rates;
				})
				.catch((error) => debug(error))
				.finally(() => (this.isBusy = false));
		}

		show(id: number) {
			const url = `${this.baseURL}/${id}`;

			this.$http
				.get(url)
				.then((response) => response.data)
				.then((responseData: { rate: Rate }) => {
					this.rate = responseData.rate;
				})
				.catch((error) => debug(error))
				.finally(() => {
					if (this.rate && this.rate.modifiers) {
						this.modifiers = [...this.rate.modifiers];
					}
					this.loading = false;
				});
		}

		tabChanged(i: number) {
			this.modifiers = [];
			if (this.rate && this.rate.modifiers) {
				this.rate.modifiers = [];
			}
			this.activeTab = i;
			this.loading = true;

			switch (i) {
				case 0:
					this.index();
					break;
				case 1:
					this.create();
					break;
				case 2:
					this.edit();
					break;
			}
		}

		update() {
			this.updating = true;
			const url = `${this.baseURL}/${this.rate.id}`;
			const data = this.rate;

			this.$http
				.put(url, data)
				.then((response) => response.data)
				.then((responseData: { errors: string[] }) => {
					if (!responseData.errors.length) {
						this.show(this.rate.id);
					}
				})
				.catch((error) => debug(error))
				.finally(() => {
					this.updating = false;
				});
		}

		addModifier() {
			const newModifier = {
				amount: 0,
				orderTotalMin: 0,
				orderTotalMax: 0,
			};
			this.rate.modifiers.push(newModifier);
		}

		removeModifier(
			index: number,
			modifier: { id?: number; deleted: boolean }
		) {
			if (modifier.id) {
				modifier.deleted = true;
			} else {
				this.rate.modifiers.splice(index, 1);
			}
		}
	},
	template,
};
