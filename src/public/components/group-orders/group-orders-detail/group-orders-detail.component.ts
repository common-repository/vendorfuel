import template from './group-orders-detail.html';
import { IState, usStates } from '../../../common/us-states';

export const GroupOrdersDetailComponent: ng.IComponentOptions = {
	bindings: {
		orderId: '<',
	},
	template,
	controller: class GroupOrdersDetailController {
		static $inject: string[] = [
			'$location',
			'Alerts',
			'Cart',
			'Group',
			'Punchout',
			'User',
			'Utils',
		];

		private orderId: number;
		public stateOptions: IState[];
		order: any;
		hasAdditionalInfo: boolean;
		additionalInfo: any;
		isSendingEmail: boolean;
		isLoading: boolean;
		isPending: boolean;
		billingAddresses: unknown[];
		shippingAddresses: unknown[];
		priceAvailability: any;
		nextOrderUrl: string;
		groupOrdersUrl: string;
		isApprovingOrder: boolean;
		isApproved: boolean;
		isCancellingOrder: boolean;
		private requestorId: number;
		isEditingItems: boolean;

		constructor(
			private $location: ng.ILocationService,
			private Alerts: any,
			private Cart: any,
			private Group: any,
			private Punchout: any,
			private User: any,
			private Utils: any
		) {
			this.stateOptions = usStates;
		}

		$onInit() {
			this.groupOrdersUrl = this.Utils.getPageUrl('group-orders');
			if (this.$location.search().pending) {
				this.isPending = true;
				this.getProfiles(this.orderId);
			}
			this.getOrder();
		}

		changeAddress(
			type: 'shipping' | 'billing',
			address: { key: string; value: string }
		) {
			const contactKeys = ['first_name', 'last_name', 'email', 'phone'];
			if (type === 'billing' || type === 'shipping') {
				Object.entries(address).forEach((field) => {
					const [key, newValue] = field;
					if (contactKeys.includes(key)) {
						this.order[type][key] =
							newValue || this.order[type][key];
					} else {
						this.order[type][key] = newValue;
					}
				});
			}
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

		completePriceAvailability = (data: any) => {
			const priceAvailabilityResponse = data;
			const order = {
				order: {
					order_id: this.orderId,
				},
				return_url: `https://${window.location.hostname}/cc-return/?OrderID=${this.orderId}`,
			};
			const reconfirm = true;
			this.Cart.priceAvailabilityResponse(
				order,
				priceAvailabilityResponse,
				reconfirm
			).then((response) => {
				if (!response.data.errors.length) {
					this.updateOrderInfo(response.data.order);
					this.priceAvailability = null;
					this.isLoading = false;
				}
			});
		};

		confirmOrder() {
			this.isLoading = true;
			const checkoutInfo = this.getCheckoutInfo();

			this.Group.confirmGroupOrder(checkoutInfo)
				.then((response) => response.data)
				.then((data) => {
					this.requestorId = data.order.customer_id;
					this.priceAvailability = data.priceAvailability || null;
					this.isLoading = false;
				});
		}

		editPendingOrder() {
			const returnUrl = this.Utils.getPageUrl('punchout-return');
			this.isEditingItems = true;
			this.Punchout.listSuppliers(this.requestorId).then((response) => {
				if (response.data.suppliers?.length) {
					const supplierId = response.data.suppliers[0].id;
					this.Punchout.supplierRequest(
						supplierId,
						returnUrl,
						this.orderId
					);
				}
			});
		}

		getAdditionalInfo(order) {
			const additionalInfo = {};
			const checkoutFields = [
				{
					key: 'attention',
					option: 'attention_option',
					name: 'Attention',
				},
				{ key: 'notes', option: 'notes_option', name: 'Notes' },
				{
					key: 'cost_center_code',
					option: 'cost_center_option',
					name: 'Cost Center Code',
				},
				{
					key: 'issuing_office',
					option: 'issuing_office_option',
					name: 'Issuing Office',
				},
				{
					key: 'organization',
					option: 'company_name_option',
					name: 'Company/Organization',
				},
				{
					key: 'rr_po_num',
					option: 'purchase_order_option',
					name: 'Purchase Order Number',
				},
			];

			const enabledCheckoutSettings = Object.entries(
				localized.settings.general.checkout
			).filter((field) => field[1]);

			// Add standard additional fields to array
			enabledCheckoutSettings.forEach((setting) => {
				const [option] = setting;
				const checkoutField = checkoutFields.find(
					(field) => field.option === option
				);

				if (checkoutField.key !== 'notes') {
					additionalInfo[checkoutField.key] = {
						name: checkoutField.name,
						value: order[checkoutField.key],
					};
				}
			});

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

		getAdditionalInfoField(key: string): string | null {
			return this.additionalInfo[key]
				? this.additionalInfo[key].value
				: null;
		}

		getCheckoutInfo() {
			return {
				selected_shipping_profile: {
					shipping_id: this.order.shipping_id,
				},
				selected_billing_profile: {
					billing_id: this.order.billing_id,
				},
				order_id: this.orderId,
				shipping_method: this.order.shipping_method_id,
				shipping_rule_id: this.order.shipping_method_id,
				shipping_first_name: this.order.shipping.first_name,
				shipping_last_name: this.order.shipping.last_name,
				shipping_email: this.order.shipping.email,
				shipping_address1: this.order.shipping.address1,
				shipping_address2: this.order.shipping.address2,
				shipping_city: this.order.shipping.city,
				shipping_state: this.order.shipping.state.toLocaleUpperCase(),
				shipping_zip: this.order.shipping.zip,
				shipping_phone: this.order.shipping.phone,
				billing_first_name: this.order.billing.first_name,
				billing_last_name: this.order.billing.last_name,
				billing_email: this.order.billing.email,
				billing_address1: this.order.billing.address1,
				billing_address2: this.order.billing.address2,
				billing_city: this.order.billing.city,
				billing_state: this.order.billing.state.toLocaleUpperCase(),
				billing_zip: this.order.billing.zip,
				billing_phone: this.order.billing.phone,
				order: {
					approver_notes: this.order.approver_notes || null,
					notes: this.order.notes || null,
					attention: this.getAdditionalInfoField('attention'),
					cost_center_code:
						this.getAdditionalInfoField('cost_center_code'),
					issuing_office:
						this.getAdditionalInfoField('issuing_office'),
					organization: this.getAdditionalInfoField('organization'),
					rr_po_num: this.getAdditionalInfoField('rr_po_num'),
					customFields: {
						f1: this.getAdditionalInfoField('f1'),
						f2: this.getAdditionalInfoField('f2'),
						f3: this.getAdditionalInfoField('f3'),
						f4: this.getAdditionalInfoField('f4'),
						f5: this.getAdditionalInfoField('f5'),
						f6: this.getAdditionalInfoField('f6'),
					},
				},
			};
		}

		getNextOrderUrl() {
			const orderBy = 'newest';
			this.Group.listGroupPendingOrders(orderBy)
				.then((response) => response.data)
				.then((data) => {
					if (data.orders.data.length) {
						this.nextOrderUrl = `${this.groupOrdersUrl}?id=${data.orders.data[0].order_id}&pending`;
					}
				});
		}

		getOrder() {
			this.isLoading = true;
			if (this.isPending) {
				this.Group.viewGroupPendingOrder(this.orderId)
					.then((response) => response.data)
					.then((order) => {
						this.processOrder(order);
						this.confirmOrder();
					});
			} else {
				this.Group.viewGroupOrder(this.orderId)
					.then((response) => response.data)
					.then((data) => {
						this.processOrder(data.order);
						this.isLoading = false;
					});
			}
		}

		getProfiles(id: number) {
			this.User.getProfiles(id)
				.then((response) => response.data)
				.then((data) => {
					this.billingAddresses = Object.values(
						data.billing_addresses
					);
					this.shippingAddresses = Object.values(
						data.shipping_addresses
					);
				});
		}

		goToIndex(e: Event): void {
			e.preventDefault();
			this.$location.search('id', null);
			this.$location.search('pending', null);
			this.orderId = null;
		}

		onClickApproveOrder(form) {
			const params = {
				order_id: this.orderId,
				payment_method: 'credit_line',
			};
			this.isApprovingOrder = true;

			this.Group.completeGroupOrder(params)
				.then((response) => response.data)
				.then((data) => {
					if (data.order_status === 'completed') {
						form.$setSubmitted();
						this.getNextOrderUrl();
						this.isApproved = true;
						this.isApprovingOrder = false;
						this.Alerts.success(
							`Order #${this.orderId} has been approved.`
						);
					}
				});
		}

		onClickCancelOrder() {
			this.isCancellingOrder = true;
			this.Group.cancelGroupPendingOrder(this.orderId).then(() => {
				this.isCancellingOrder = false;
				this.$location.search('id', null);
				this.$location.search('pending', null);
				this.orderId = null;
			});
		}

		onClickSaveChanges(form) {
			this.confirmOrder();
			form.$setPristine();
		}

		processOrder(order) {
			this.order = order;
			this.hasAdditionalInfo = this.checkAdditionalInfo(order);
			this.additionalInfo = this.getAdditionalInfo(order);
		}

		removeItem(productId: number) {
			const { orderId } = this;
			this.Group.groupPendingOrderRemoveItem(orderId, productId).then(
				() => {
					this.getOrder();
				}
			);
		}

		sendOrderEmail(orderId): void {
			this.isSendingEmail = true;
			this.User.sendOrderEmail(orderId).then(() => {
				this.isSendingEmail = false;
			});
		}

		/**
		 * Update some order info after Price Availability Check.
		 *
		 * @param {Object} order
		 */
		updateOrderInfo(order: any) {
			this.order.items = Object.values(order.items);
			this.order.subtotal = order.subtotal;
			this.order.total_amt = order.total_amt;
			this.order.promo_discount = order.promo_discount;
			this.order.shipping_total = order.shipping;
			this.order.tax = order.tax;
		}
	},
};
