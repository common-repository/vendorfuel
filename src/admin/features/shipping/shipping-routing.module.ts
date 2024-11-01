declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'shipping',
		url: '/shipping',
		abstract: true,
	},
	{
		name: 'shipping.page',
		url: '',
		component: 'shippingPage',
	},
	{
		name: 'shipping.flat-rates',
		url: '/flat-rates',
		abstract: true,
	},
	{
		name: 'shipping.flat-rates.index',
		url: '/:activeTab',
		component: 'flatRatesPage',
		params: {
			activeTab: {
				dynamic: true,
			},
		},
	},
	{
		name: 'shipping.parcels',
		url: '/parcels',
		abstract: true,
	},
	{
		name: 'shipping.parcels.index',
		url: '/:activeTab',
		component: 'parcelsPage',
		params: {
			activeTab: {
				dynamic: true,
			},
		},
	},
];

export const ShippingRoutingModule = angular
	.module( 'ShippingRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'shipping' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
