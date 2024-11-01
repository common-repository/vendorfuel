declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'customers',
		url: '/customers',
		abstract: true,
	},
	{
		name: 'customers.page',
		url: '',
		component: 'vfCustomers',
	},
	{
		name: 'customers.accounts',
		url: '/accounts',
		abstract: true,
	},
	{
		name: 'customers.accounts.index',
		url: '',
		component: 'accountsIndex',
	},
	{
		name: 'customers.accounts.settings',
		url: '/settings',
		component: 'accountsSettings',
	},
	{
		name: 'customers.accounts.edit',
		url: '/:id',
		component: 'accountEdit',
	},
	{
		name: 'customers.accounts.create',
		url: '/new',
		component: 'accountEdit',
	},
	{
		name: 'customers.uploads',
		url: '/uploads',
		abstract: true,
		template: '<ui-view/>',
	},
	{
		name: 'customers.uploads.index',
		url: '',
		component: 'customerUploadsIndex',
	},
	{
		name: 'customers.uploads.show',
		url: '/:id',
		component: 'customerUploadShow',
	},
	{
		name: 'customers.uploads.create',
		url: '/new',
		component: 'customerUploadCreate',
	},
	{
		name: 'customers.groups',
		url: '/groups',
		abstract: true,
	},
	{
		name: 'customers.groups.index',
		url: '/:activeTab',
		component: 'groupsIndex',
		params: {
			activeTab: {
				dynamic: true,
			},
			customer: {
				dynamic: true,
			},
		},
	},
	{
		name: 'customers.roles',
		url: '/roles',
		abstract: true,
		template: '<ui-view/>',
	},
	{
		name: 'customers.roles.index',
		url: '',
		component: 'rolesPage',
	},
	{
		name: 'customers.roles.create',
		url: '/new',
		component: 'rolePage',
	},
	{
		name: 'customers.roles.edit',
		url: '/:id',
		component: 'rolePage',
	},
];

export const CustomersRoutingModule = angular
	.module( 'CustomersRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
	) => {
		'ngInject';

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'customers' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
