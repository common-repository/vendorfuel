declare const angular: ng.IAngularStatic;

const states: Array<ng.ui.IState> = [ {
	name: 'reset-password',
	url: '/reset-password?code&auth',
	component: 'resetPasswordPage',
	params: {
		activeTab: {
			dynamic: true,
			code: null,
			auth: null,
		},
	},
} ];

export const ResetPasswordRoutingModule = angular
	.module( 'ResetPasswordRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			$stateProvider.state( state );
		} );
	} )
	.name;
