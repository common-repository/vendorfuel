declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'billing',
		url: '/billing',
		component: 'billingPage',
		params: {
			activeTab: {
				dynamic: true,
			},
		},
	},
	{
		name: 'billing-reset-password',
		url: '/billing-reset-password?code&auth',
		component: 'billingResetPasswordPage',
		params: {
			activeTab: {
				dynamic: true,
				code: null,
				auth: null,
			},
		},
	},
];

export const BillingRoutingModule = angular
	.module( 'BillingRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'billing' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
