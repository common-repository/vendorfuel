import angular from 'angular';
import { react2angular } from 'react2angular';
import { ReportsPage } from './reports-page.component';
import { reportsFactory } from './reports.factory';
import { DeleteButton } from '../components/ui/DeleteButton';

export const ReportsModule = angular
	.module('ReportsModule', [])
	.component('reportsPage', ReportsPage)
	.component(
		'deleteButton',
		react2angular(DeleteButton, ['modelName', 'modelId', 'onDelete'])
	)
	.factory('Reports', reportsFactory).name;
