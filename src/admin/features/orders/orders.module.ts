import angular from 'angular';
import { OrdersIndexComponent } from '.';
import { OrdersDetailComponent } from './show';
import { OrderTrackingComponent } from '../../orders/orders-tracking/orders-tracking.component';
import { OrdersService } from '../../orders/orders.service';

export const OrdersModule = angular
	.module('OrdersModule', [])
	.service('OrdersService', OrdersService)
	.component('ordersIndex', OrdersIndexComponent)
	.component('ordersDetail', OrdersDetailComponent)
	.component('orderTracking', OrderTrackingComponent).name;
