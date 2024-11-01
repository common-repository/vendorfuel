declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [ {
	name: 'reports',
	url: '/reports',
	component: 'reportsPage',
	params: {
		activeTab: {
			dynamic: true,
		},
	},
} ];

export const ReportsRoutingModule = angular
	.module( 'ReportsRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'reports' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
