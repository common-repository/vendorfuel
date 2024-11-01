declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'admin',
		url: '/admin',
		abstract: true,
	},
	{
		name: 'admin.page',
		url: '',
		component: 'adminAccountsPage',
	},
];

export const AdminAccountsRoutingModule = angular
	.module( 'AdminAccountsRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'admin' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
