import angular from 'angular';
import { react2angular } from 'react2angular';
import { AdminAccountEdit } from './edit';
import { confirmModalFactory } from '../../components/ui/modals/confirm-modal.factory';
import { twoFactorModalFactory } from '../../components/ui/modals/two-factor-modal.factory';

export const AdminAccountsModule = angular
	.module('AdminAccountsModule', [])
	.factory('ConfirmModal', confirmModalFactory)
	.factory('TwoFactorModal', twoFactorModalFactory)
	.component('adminAccountEdit', react2angular(AdminAccountEdit)).name;
