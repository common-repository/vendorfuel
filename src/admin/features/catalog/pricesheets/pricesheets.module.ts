import angular from 'angular';
import { PricesheetEdit } from './pricesheet-edit.component';
import { PricesheetCreate } from './pricesheet-create.component';
import { searchModalFactory } from '../../../shared/modal/search-modal.factory';

export const PricesheetsModule = angular
	.module('PricesheetsModule', [])
	.component('pricesheetEdit', PricesheetEdit)
	.component('pricesheetCreate', PricesheetCreate).name;
