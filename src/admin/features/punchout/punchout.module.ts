declare const angular: ng.IAngularStatic;

import { PunchoutIndex } from './punchout-index.component';
import { confirmModalFactory } from '../../components/ui/modals/confirm-modal.factory';

export const PunchoutModule = angular
	.module('PunchoutModule', [])
	.factory('ConfirmModal', confirmModalFactory)
	.component('punchoutIndex', PunchoutIndex).name;
