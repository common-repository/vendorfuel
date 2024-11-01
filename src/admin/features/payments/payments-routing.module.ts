declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [ {
	name: 'payments',
	url: '/payments',
	component: 'paymentsPage',
	params: {
		activeTab: {
			dynamic: true,
		},
	},
} ];

export const PaymentsRoutingModule = angular
	.module( 'PaymentsRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'payments' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
