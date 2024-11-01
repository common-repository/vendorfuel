declare const angular: ng.IAngularStatic;

const states: Array<ng.ui.IState> = [ {
	name: 'tenant-login',
	url: '/tenant-login',
	component: 'tenantLoginPage',
	params: {
		activeTab: {
			dynamic: true,
		},
	},
} ];

export const TenantLoginRoutingModule = angular
	.module( 'TenantLoginRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			$stateProvider.state( state );
		} );
	} )
	.name;
