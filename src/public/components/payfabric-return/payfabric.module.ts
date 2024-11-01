import angular from 'angular';
import { PayfabricReturn } from './payfabric-return.component';

export const PayfabricModule = angular
	.module('PayfabricModule', [])
	.component('payfabricReturn', PayfabricReturn).name;
