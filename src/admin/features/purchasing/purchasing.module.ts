import angular from 'angular';
import { react2angular } from 'react2angular';
import { PurchasingCostSheetsComponent } from './cost-sheets/purchasing-cost-sheets.component';
import { DocumentProfilePage } from './document-profiles/DocumentProfilePage';
import { confirmModalFactory } from '../../components/ui/modals/confirm-modal.factory';
import { searchModalFactory } from '../../shared/modal/search-modal.factory';
import { CostSheetUploadCreate } from '../../purchasing/cost-sheets/uploads/CostsheetUploadCreate';

export const PurchasingModule = angular
	.module('PurchasingModule', [])
	.factory('ConfirmModal', confirmModalFactory)
	.component('documentProfilePage', react2angular(DocumentProfilePage))
	.component('purchasingCostSheets', PurchasingCostSheetsComponent).name;
