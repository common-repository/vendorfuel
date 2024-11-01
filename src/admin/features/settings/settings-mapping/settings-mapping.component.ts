import template from './settings-mapping.component.html';

export const SettingsMappingComponent: ng.IComponentOptions = {
	template,
	controller: class SettingsMappingController {
		static $inject = ['SettingsMappingService'];
		lockedKeys: string[] = [
			'account',
			'addresses',
			'cart',
			'catalog',
			'checkout',
			'favorites',
			'forgot-password',
			'group-account',
			'group-orders',
			'login',
			'order-by-sku',
			'orders',
			'product-detail',
			'punchout-return',
			'register',
			'reset-password',
			'saved-cart',
			'saved-carts',
			'view-order',
		];
		isConfirmingDeletion: boolean[] = [];
		isLoading: boolean;
		map: any;
		pages: any;
		isAddingKey: boolean;
		isUpdating: boolean;
		pattern: RegExp;
		newKey: {
			key: string;
			value: {
				id?: number;
				url?: string;
				title?: string;
				template?: string;
			};
		};

		constructor(private SettingsMappingService: any) {
			this.pattern = new RegExp('^[a-z\\-]*$');
		}

		$onInit() {
			this.resetNewKey();
			this.getData();
		}

		addKey(key: string, value: { id: number; url: string; title: string }) {
			this.map[key] = {
				id: value.id,
				url: value.url,
				title: value.title,
				template: key,
			};
			this.isAddingKey = false;
			this.resetNewKey();
		}

		getData() {
			this.isLoading = true;
			this.SettingsMappingService.get().then((response: any) => {
				this.map = response[0];
				this.pages = response[1];
				this.isLoading = false;
			});
		}

		resetNewKey() {
			this.newKey = {
				key: '',
				value: null,
			};
		}

		update(newMap: any) {
			this.isUpdating = true;
			const data = {
				map: JSON.stringify(newMap),
			};

			this.SettingsMappingService.update(data).then(() => {
				this.isUpdating = false;
				this.getData();
			});
		}
	},
};
