declare const angular: ng.IAngularStatic;

const states: Array<ng.ui.IState> = [ {
	name: 'login',
	url: '/login',
	component: 'loginPage',
} ];

export const LoginRoutingModule = angular
	.module( 'LoginRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			$stateProvider.state( state );
		} );
	} )
	.name;
