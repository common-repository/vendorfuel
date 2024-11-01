import angular from 'angular';
import { BillingPage } from './billing-page.component';
import { BillingResetPasswordPage } from './billing-reset-password-page.component';
import { confirmModalFactory } from '../../components/ui/modals/confirm-modal.factory';

export const BillingModule = angular
	.module('BillingModule', [])
	.component('billingPage', BillingPage)
	.component('billingResetPasswordPage', BillingResetPasswordPage)
	.factory('ConfirmModal', confirmModalFactory).name;
