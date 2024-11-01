import angular from 'angular';
import { searchModalFactory } from './modal/search-modal.factory';
import { SelectModal } from './modal/select-modal.component';

export const SharedModule = angular
	.module('SharedModule', [])
	.factory('SearchModal', searchModalFactory)
	.component('selectModal', SelectModal).name;
