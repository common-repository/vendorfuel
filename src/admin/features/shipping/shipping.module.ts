import angular from 'angular';
import { FlatRatesPage } from './rates';

export const ShippingModule = angular
	.module('ShippingModule', [])
	.component('flatRatesPage', FlatRatesPage).name;
