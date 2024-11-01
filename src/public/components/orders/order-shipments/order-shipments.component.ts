import template from './order-shipments.component.html';

interface Shipment {
	carrier: string;
	code: string;
	shipment_date: number;
}

const OrderShipmentsComponent: ng.IComponentOptions = {
	bindings: {
		shipments: '<',
	},
	template,
	controller: class OrderShipmentsController {
		shipments: { [key: number]: Shipment } | Shipment[];
		$onChanges(): void {
			if (this.shipments && !Array.isArray(this.shipments)) {
				this.shipments = Object.values(this.shipments);
			}
		}
	},
};

export default OrderShipmentsComponent;
