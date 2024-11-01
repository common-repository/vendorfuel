import angular from 'angular';
import { react2angular } from 'react2angular';
import { ReportsPage } from '../../pages/reports';
import { DeleteButton } from '../../components/ui/DeleteButton';

export const ReportsModule = angular
	.module('ReportsModule', [])
	.component('reportsPage', ReportsPage)
	.component(
		'deleteButton',
		react2angular(DeleteButton, ['modelName', 'modelId', 'onDelete'])
	).name;
