import angular from 'angular';
import { PaymentsPage } from '.';
import { PaymentProcessorController } from './payment-processor.controller';

export const PaymentsModule = angular
	.module('PaymentsModule', [])
	.component('paymentsPage', PaymentsPage)
	.controller('PaymentProcessorController', PaymentProcessorController).name;
