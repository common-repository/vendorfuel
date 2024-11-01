import angular from 'angular';
import { FlatRatesPage } from './rates/rates-page.component';

export const ShippingModule = angular
	.module('ShippingModule', [])
	.component('flatRatesPage', FlatRatesPage).name;
