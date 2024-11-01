declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'purchasing',
		url: '/purchasing',
		abstract: true,
		template: '<ui-view/>',
	},
	{
		name: 'purchasing.page',
		url: '',
		component: 'purchasingPage',
	},
	{
		name: 'purchasing.document-profiles',
		url: '/document-profiles',
		abstract: true,
		template: '<ui-view/>',
	},
	{
		name: 'purchasing.document-profiles.index',
		url: '',
		component: 'documentProfilesPage',
	},
	{
		name: 'purchasing.document-profiles.create',
		url: '/new',
		component: 'documentProfilePage',
	},
	{
		name: 'purchasing.document-profiles.edit',
		url: '/:id',
		component: 'documentProfilePage',
	},
	{
		name: 'purchasing.cost-sheets',
		url: '/cost-sheets/:activeTab',
		component: 'purchasingCostSheets',
		params: {
			activeTab: {
				dynamic: true,
			},
			product: {
				dynamic: true,
			},
		},
	},
	{
		name: 'purchasing.vendors',
		url: '/vendors/:activeTab',
		component: 'purchasingVendors',
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

export const PurchasingRoutingModule = angular
	.module( 'PurchasingRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'purchasing' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
