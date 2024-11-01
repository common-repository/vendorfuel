import { State, usStates } from '../../../../data/usStates';
import template from './customer-address-modal.component.html';

export const CustomerAddressModalComponent: ng.IComponentOptions = {
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&',
	},
	template,
	controller: class CustomerAddressModalController {
		static $inject = ['$http', 'Debug'];
		errors: string[] = [];
		type!: 'shipping' | 'billing';
		resolve!: {
			type: 'shipping' | 'billing';
			customerId: number;
		};
		customerId!: number;
		usStates: State[];
		address: any;
		addresses: unknown[];
		isAdding = false;
		isEditing = false;
		isConfirmingDeletion: boolean[];
		isStoring = false;
		isDeleting = false;
		isLoading = false;
		isUpdating = false;
		close: any;
		nextApiURL = localized.apiURL.replace('v1', 'v2');
		page = 1;

		constructor(private $http: ng.IHttpService, private Debug: any) {
			this.usStates = usStates;
		}

		$onInit() {
			this.type = this.resolve.type;
			this.customerId = this.resolve.customerId;
			this.indexAddresses();
		}

		add() {
			this.address = {};
			this.errors = [];
			this.isAdding = true;
			this.isEditing = false;
		}

		cancel() {
			this.address = {};
			this.errors = [];
			this.isAdding = false;
			this.isEditing = false;
			this.indexAddresses();
		}

		/**
		 * @param {Array} data
		 * @return {Array} Addresses with uppercase state property.
		 */
		convertUsStates(data: any[]) {
			return data.map((address) => {
				address.state = address.state.toLocaleUpperCase();
				return address;
			});
		}

		storeAddress() {
			this.isStoring = true;
			const url = `${this.nextApiURL}/admin/customers/${this.customerId}/addresses/`;
			const data = {
				...this.address,
				type: this.type,
			};

			this.$http
				.post(url, data)
				.then((response) => {
					if (!response.data.errors.length) {
						this.isAdding = false;
						this.indexAddresses();
					} else {
						this.errors = response.data.errors;
					}
				})
				.finally(() => {
					this.isStoring = false;
				});
		}

		edit(e: Event, address: any) {
			e.preventDefault();
			this.address = address;
			this.isEditing = true;
			this.isAdding = false;
		}

		destroyAddress(e: Event, address: any) {
			this.isDeleting = true;
			e.preventDefault();
			const url = `${this.nextApiURL}/admin/customers/${this.customerId}/addresses/${address.id}`;
			this.$http.delete(url).then(() => {
				this.address = {};
				this.isEditing = false;
				this.isDeleting = false;
				this.indexAddresses();
			});
		}

		indexAddresses() {
			this.isLoading = true;
			const url = `${this.nextApiURL}/admin/customers/${this.customerId}/addresses`;
			const config = {
				params: {
					type: this.type,
					page: this.page,
				},
			};
			this.$http
				.get(url, config)
				.then((response) => {
					this.addresses = response.data.addresses;
					this.addresses.data = this.convertUsStates(
						this.addresses.data
					);
				})
				.catch((error: Error) => {
					this.Debug.error(error);
				})
				.finally(() => {
					this.isLoading = false;
				});
		}

		ok() {
			this.close({ $value: 'close' });
		}

		setPage(page: number) {
			this.page = page;
			this.indexAddresses();
		}

		updateAddress() {
			this.isUpdating = true;
			const url = `${this.nextApiURL}/admin/customers/${this.customerId}/addresses/${this.address.id}`;
			const data = this.address;

			this.$http
				.put(url, data)
				.then((response) => {
					if (!response.data.errors.length) {
						this.isEditing = false;
						this.indexAddresses();
					} else {
						this.errors = response.data.errors;
					}
				})
				.finally(() => {
					this.isUpdating = false;
				});
		}
	},
};
