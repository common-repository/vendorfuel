import angular from 'angular';
import { PromoCodesService } from './promo-codes.service';
import { PromoCodesIndex } from './promo-codes-index.component';
import { searchModalFactory } from '../../../shared/modal/search-modal.factory';

export const PromoCodesModule = angular
	.module('PromoCodesModule', [])
	.service('PromoCodesService', PromoCodesService)
	.component('promoCodesIndex', PromoCodesIndex).name;
