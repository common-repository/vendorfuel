import angular from 'angular';
import { OrderAddToCartButton } from './order-add-to-cart-button';
import { OrderDetailsListItemComponent } from './order-details-list-item';

export const OrdersModule = angular
	.module('OrdersModule', [])
	.component('orderDetailsListItem', OrderDetailsListItemComponent)
	.component('orderAddToCartButton', OrderAddToCartButton).name;
