import template from './order-change-logs.html';

export const OrderChangeLogsComponent: ng.IComponentOptions = {
	bindings: {
		logs: '<',
	},
	template,
	controller: class OrderChangeLogsController {},
};
