declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'email',
		url: '/email',
		component: 'emailPage',
	},
];

export const EmailRoutingModule = angular
	.module( 'EmailRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'email' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
