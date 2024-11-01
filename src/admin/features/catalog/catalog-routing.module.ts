declare const angular: ng.IAngularStatic;
import { highlightMenuItem } from '../../utils/highlightMenuItem';

const states: Array<ng.ui.IState> = [
	{
		name: 'catalog',
		url: '/catalog',
		abstract: true,
	},
	{
		name: 'catalog.page',
		url: '',
		component: 'catalogPage',
	},
	{
		name: 'catalog.banners',
		url: '/banners',
		abstract: true,
	},
	{
		name: 'catalog.banners.index',
		url: '/:activeTab',
		component: 'bannersIndex',
		params: {
			activeTab: {
				dynamic: true,
			},
		},
	},
	{
		name: 'catalog.categories',
		url: '/categories',
		abstract: true,
	},
	{
		name: 'catalog.categories.index',
		url: '/:activeTab',
		component: 'categoriesIndex',
		params: {
			activeTab: {
				dynamic: true,
			},
		},
	},
	{
		name: 'catalog.products',
		url: '/products',
		abstract: true,
	},
	{
		name: 'catalog.products.index',
		url: '',
		component: 'productsIndex',
	},
	{
		name: 'catalog.products.edit',
		url: '/:id',
		component: 'productEdit',
	},
	{
		name: 'catalog.products.create',
		url: '/new',
		component: 'productCreate',
	},
	{
		name: 'catalog.products.utilities',
		url: '/utilities',
		component: 'productUtilities',
	},
	{
		name: 'catalog.products.uploads',
		url: '/uploads',
		abstract: true,
	},
	{
		name: 'catalog.products.uploads.index',
		url: '',
		component: 'productUploadsIndex',
	},
	{
		name: 'catalog.products.uploads.show',
		url: '/:id',
		component: 'productUploadShow',
	},
	{
		name: 'catalog.products.uploads.create',
		url: '/new',
		component: 'productUploadCreate',
	},
	{
		name: 'catalog.products.reviews',
		url: '/reviews',
		abstract: true,
		template: '<ui-view/>',
	},
	{
		name: 'catalog.products.reviews.index',
		url: '',
		component: 'reviewsIndex',
	},
	{
		name: 'catalog.products.reviews.show',
		url: '/:id',
		component: 'reviewsEdit',
	},
	{
		name: 'catalog.collections',
		url: '/collections',
		abstract: true,
	},
	{
		name: 'catalog.collections.index',
		url: '/:activeTab',
		component: 'collectionsIndex',
		params: {
			activeTab: {
				dynamic: true,
			},
		},
	},
	{
		name: 'catalog.manufacturers',
		url: '/manufacturers',
		abstract: true,
	},
	{
		name: 'catalog.manufacturers.index',
		url: '',
		component: 'manufacturersIndex',
	},
	{
		name: 'catalog.manufacturers.create',
		url: '/create',
		component: 'manufacturerEdit',
	},
	{
		name: 'catalog.manufacturers.show',
		url: '/:id',
		component: 'manufacturerEdit',
	},
	{
		name: 'catalog.pricesheets',
		url: '/pricesheets',
		abstract: true,
	},
	{
		name: 'catalog.pricesheets.index',
		url: '',
		component: 'pricesheetsIndex',
	},
	{
		name: 'catalog.pricesheets.edit',
		url: '/:id',
		component: 'pricesheetEdit',
	},
	{
		name: 'catalog.pricesheets.create',
		url: '/new',
		component: 'pricesheetCreate',
	},
	{
		name: 'catalog.pricesheets.uploads',
		url: '/uploads',
		abstract: true,
	},
	{
		name: 'catalog.pricesheets.uploads.index',
		url: '',
		component: 'pricesheetUploadsIndex',
	},
	{
		name: 'catalog.pricesheets.uploads.show',
		url: '/:id',
		component: 'pricesheetUploadShow',
	},
	{
		name: 'catalog.pricesheets.uploads.create',
		url: '/new',
		component: 'pricesheetUploadCreate',
	},
	{
		name: 'catalog.promo-codes',
		url: '/promo-codes',
		abstract: true,
	},
	{
		name: 'catalog.promo-codes.index',
		url: '/:activeTab',
		component: 'promoCodesIndex',
		params: {
			activeTab: {
				dynamic: true,
			},
		},
	},
];

export const CatalogRoutingModule = angular
	.module( 'CatalogRoutingModule', [] )
	.config( (
		$stateProvider: ng.ui.IStateProvider,
		$urlRouterProvider: ng.ui.IUrlRouterProvider,
	) => {
		'ngInject';

		$urlRouterProvider.otherwise( 'catalog' );

		states.forEach( ( state ) => {
			state.onEnter = () => {
				highlightMenuItem( 'catalog' );
			};
			$stateProvider.state( state );
		} );
	} )
	.name;
