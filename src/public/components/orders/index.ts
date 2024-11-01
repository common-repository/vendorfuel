import angular from 'angular';
import { OrdersIndexComponent } from './orders-index/orders-index.component';
import { OrdersDetailComponent } from './orders-detail/orders-detail.component';
import { OrderChangeLogsComponent } from './order-change-logs/order-change-logs.component';
import OrderShipmentsComponent from './order-shipments/order-shipments.component';

angular
	.module('vfApp')
	.component('ordersIndex', OrdersIndexComponent)
	.component('ordersDetail', OrdersDetailComponent)
	.component('orderChangeLogs', OrderChangeLogsComponent)
	.component('orderShipments', OrderShipmentsComponent);
