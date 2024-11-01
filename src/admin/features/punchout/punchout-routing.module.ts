declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'punchout',
		url: '/punchout',
		abstract: true,
	},
	{
		name: 'punchout.page',
		url: '',
		component: 'punchoutPage',
	},
	{
		name: 'punchout.suppliers',
		url: '/suppliers',
		abstract: true,
	},
	{
		name: 'punchout.suppliers.index',
		url: '/:activeTab',
		component: 'punchoutIndex',
		params: {
			activeTab: {
				dynamic: true,
			},
			product: {
				dynamic: true,
			},
		},
	},
];

export const PunchoutRoutingModule = angular
	.module( 'PunchoutRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'punchout' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
