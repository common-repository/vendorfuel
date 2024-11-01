import angular from 'angular';
import { adminFactory } from './admin.factory';
import { debugFactory } from './debug.factory';
import { emailsDataFactory } from './emailData.factory';
import { interceptorFactory } from './interceptor.factory';
import { LocalizedService } from './localized.service';
import { priceSheetsFactory } from './pricesheets.factory';
import { relationshipSearchFactory } from './relationship-search.factory';
import { settingsFactory } from './settings.factory';
import { utilsFactory } from './utils.factory';

export const ServicesModule = angular
	.module('ServicesModule', [])
	.factory('vfAdminInterceptor', interceptorFactory)
	.factory('Utils', utilsFactory)
	.factory('Admin', adminFactory)
	.factory('Debug', debugFactory)
	.factory('EmailsData', emailsDataFactory)
	.factory('PriceSheets', priceSheetsFactory)
	.factory('RelationshipSearch', relationshipSearchFactory)
	.factory('Settings', settingsFactory)
	.service('Localized', LocalizedService).name;
