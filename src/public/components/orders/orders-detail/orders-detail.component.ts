import template from './orders-detail.html';

export const OrdersDetailComponent: ng.IComponentOptions = {
	bindings: {
		orderId: '<',
	},
	template,
	controller: class OrdersDetailController {
		static $inject: string[] = ['$location', 'User'];
		private orderId: boolean;
		order: any;
		hasAdditionalInfo: boolean;
		additionalInfo: any;
		isSendingEmail: boolean;
		isLoading: boolean;

		// eslint-disable-next-line no-useless-constructor
		constructor(
			private $location: ng.ILocationService,
			private User: any
		) {}

		$onInit() {
			this.getOrder();
		}

		checkAdditionalInfo(order): boolean {
			if (
				order.rr_po_num ||
				order.organization ||
				order.issuing_office ||
				order.cost_center_code ||
				order.attention ||
				order.notes ||
				order.approver_notes ||
				order.custom_fields.f1.value ||
				order.custom_fields.f2.value ||
				order.custom_fields.f3.value ||
				order.custom_fields.f4.value ||
				order.custom_fields.f5.value ||
				order.custom_fields.f6.value
			) {
				return true;
			}
		}

		getAdditionalInfo(order) {
			const additionalInfo = {};
			const fields = {
				attention: 'Attention',
				approver_notes: 'Approver Notes',
				cost_center_code: 'Cost Center Code',
				issuing_office: 'Issuing Office',
				notes: 'Notes',
				organization: 'Company/Organization Name',
				rr_po_num: 'Purchase Order Number',
			};

			// Add standard additional fields to array
			for (const key of Object.keys(fields)) {
				if (order[key]) {
					additionalInfo[key] = {
						name: fields[key],
						value: order[key],
					};
				}
			}

			// Add or replace custom fields to additional fields
			for (const [key, field] of Object.entries(order.custom_fields)) {
				if (field.value) {
					if (field.replace_field && additionalInfo[key]) {
						additionalInfo[key] = {
							name: field.name,
							value: field.value,
							isReplacingField: true,
						};
					} else {
						additionalInfo[key] = {
							name: field.name,
							value: field.value,
						};
					}
				}
			}
			return additionalInfo;
		}

		getOrder() {
			this.isLoading = true;
			this.User.viewOrder(this.orderId)
				.then((response) => response.data)
				.then((data) => {
					this.order = data.order;
					this.hasAdditionalInfo = this.checkAdditionalInfo(
						this.order
					);
					this.additionalInfo = this.getAdditionalInfo(this.order);
					this.isLoading = false;
				});
		}

		goToIndex(e: Event): void {
			e.preventDefault();
			this.$location.search('id', null);
			this.orderId = null;
		}

		sendOrderEmail(orderId): void {
			this.isSendingEmail = true;
			this.User.sendOrderEmail(orderId).then(() => {
				this.isSendingEmail = false;
			});
		}
	},
};
