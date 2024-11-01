import angular from 'angular';
import { OrdersIndexComponent } from './orders-index/orders-index.component';
import { OrdersDetailComponent } from './orders-detail/orders-detail.component';
import { OrderTrackingComponent } from './orders-tracking/orders-tracking.component';
import { OrdersService } from './orders.service';

export const OrdersModule = angular
	.module('OrdersModule', [])
	.service('OrdersService', OrdersService)
	.component('ordersIndex', OrdersIndexComponent)
	.component('ordersDetail', OrdersDetailComponent)
	.component('orderTracking', OrderTrackingComponent).name;
