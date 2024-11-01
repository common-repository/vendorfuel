import angular from 'angular';
import { AddressIndexComponent } from './address-index/address-index.component';
import { AddressFormComponent } from './address-form/address-form.component';

angular
	.module('vfApp')
	.component('addressIndex', AddressIndexComponent)
	.component('addressForm', AddressFormComponent);
