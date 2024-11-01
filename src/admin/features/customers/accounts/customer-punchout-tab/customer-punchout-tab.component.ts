interface Supplier {
	name: string;
	id: number;
	logo?: string;
}

import template from './customer-punchout-tab.html';

export const CustomerPunchoutTabComponent: ng.IComponentOptions = {
	template,
	bindings: {
		customer: '<',
		suppliers: '<',
		onChange: '&',
	},
	controller: class CustomerPunchoutTabController {
		static $inject: string[] = ['CustomersService'];

		isAttaching: boolean[] = [];
		isDetaching: boolean[] = [];
		isUpdating: boolean;
		customer: {
			mixed_punchout: boolean;
			punchout_only: boolean;
			punchout_suppliers: Supplier[];
			price_availability: boolean;
			id: number;
			name: string;
		};
		suppliers: Supplier[];
		availableSuppliers: Supplier[];

		constructor(private CustomersService: any) {}

		$onInit() {
			if (this.customer.punchout_suppliers) {
				this.availableSuppliers = this.getAvailableSuppliers(
					this.customer.punchout_suppliers,
					this.suppliers
				);
			}
		}

		attachSupplier(id: number) {
			this.isAttaching[id] = true;
			const data = {
				name: this.customer.name,
				punchout_suppliers: [{ id }],
			};

			this.CustomersService.update(this.customer.id, data).then(
				(response: any) => {
					this.customer = response.customer;
					this.availableSuppliers = this.getAvailableSuppliers(
						this.customer.punchout_suppliers,
						this.suppliers
					);
					this.isAttaching[id] = false;
				}
			);
		}

		change(key: string, value: string | boolean) {
			(this.customer as any)[key] = value;
		}

		detachSupplier(id: number) {
			this.isDetaching[id] = true;
			const data = {
				name: this.customer.name,
				punchout_suppliers: [{ id, deleted: true }],
			};

			this.CustomersService.update(this.customer.id, data).then(
				(response: any) => {
					this.customer = response.customer;
					this.availableSuppliers = this.getAvailableSuppliers(
						this.customer.punchout_suppliers,
						this.suppliers
					);
					this.isDetaching[id] = false;
				}
			);
		}

		getAvailableSuppliers(
			attachedSuppliers: { id: number }[],
			suppliers: Supplier[]
		) {
			if (suppliers?.length) {
				const ids = attachedSuppliers.map((el) => el.id);
				return suppliers.filter((supplier) => {
					return !ids.includes(supplier.id);
				});
			}
		}
	},
};
