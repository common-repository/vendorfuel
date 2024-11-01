declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'orders',
		url: '/orders',
		abstract: true,
		template: '<ui-view/>',
	},
	{
		name: 'orders.index',
		url: '',
		component: 'ordersIndex',
	},
	{
		name: 'orders.show',
		url: '/:id',
		component: 'ordersDetail',
	},
	{
		name: 'orders.tracking',
		url: '/tracking',
		component: 'orderTracking',
	},
];

export const OrdersRoutingModule = angular
	.module( 'OrdersRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'orders' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
