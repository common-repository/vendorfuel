import angular from 'angular';
import { react2angular } from 'react2angular';
import { TaxesPageComponent } from './taxes-page.component';
import { TaxesAvalaraComponent } from './taxes-avalara.component';
import { TaxesOptions } from './TaxesOptions';
import { alertModalFactory } from '../../components/ui/modals/alert-modal.factory';

export const TaxesModule = angular
	.module('TaxesModule', [])
	.component('taxesPage', TaxesPageComponent)
	.component('taxesAvalara', TaxesAvalaraComponent)
	.component('taxesOptions', react2angular(TaxesOptions))
	.factory('AlertModal', alertModalFactory).name;
