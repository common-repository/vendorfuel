import angular from 'angular';
import './group-order-details-list-item/group-order-details-list-item.component';

import { GroupOrdersIndexComponent } from './group-orders-index/group-orders-index.component';
import { GroupOrdersDetailComponent } from './group-orders-detail/group-orders-detail.component';

angular
	.module('vfApp')
	.component('groupOrdersIndex', GroupOrdersIndexComponent)
	.component('groupOrdersDetail', GroupOrdersDetailComponent);
