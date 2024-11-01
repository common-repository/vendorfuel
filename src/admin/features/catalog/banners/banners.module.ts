import angular from 'angular';
import { BannersIndex } from './banners-index.component';
import { confirmModalFactory } from '../../../components/ui/modals/confirm-modal.factory';

export const BannersModule = angular
	.module('BannersModule', [])
	.component('bannersIndex', BannersIndex)
	.factory('ConfirmModal', confirmModalFactory).name;
