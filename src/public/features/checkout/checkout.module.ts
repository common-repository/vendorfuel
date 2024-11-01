import angular from 'angular';
import { CheckoutComponent } from './checkout.component';
import { CheckoutBillingAddress } from './checkout-billing-address/checkout-billing-address.component';
import { CheckoutFinalizeOrder } from './checkout-finalize-order/checkout-finalize-order.component';
import { CheckoutShippingAddress } from './checkout-shipping-address/checkout-shipping-address.component';

export const CheckoutModule = angular
	.module('CheckoutModule', [])
	.component('vfCheckout', CheckoutComponent)
	.component('checkoutBillingAddress', CheckoutBillingAddress)
	.component('checkoutFinalizeOrder', CheckoutFinalizeOrder)
	.component('checkoutShippingAddress', CheckoutShippingAddress).name;
