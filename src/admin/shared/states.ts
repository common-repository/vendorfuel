export const states: ng.ui.IState[] = [
	/**
	 * Admin users
	 */
	{
		name: 'admin',
		url: '/admin',
		abstract: true,
	},
	{
		name: 'admin.edit',
		url: '/:id',
		component: 'adminAccountEdit',
	},
	{
		name: 'admin.create',
		url: '/create',
		component: 'adminAccountEdit',
	},
	/**
	 * Catalog
	 */
	{
		name: 'catalog',
		url: '/catalog',
		abstract: true,
	},
	// Banners
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
	/**
	 * Categories
	 */
	{
		name: 'catalog.categories',
		url: '/categories',
		abstract: true,
	},
	{
		name: 'catalog.categories.create',
		url: '/create',
		component: 'categoryCreate',
	},
	{
		name: 'catalog.categories.edit',
		url: '/:id',
		component: 'categoryEdit',
	},
	{
		name: 'catalog.products',
		url: '/products',
		abstract: true,
	},
	{
		name: 'catalog.products.edit',
		url: '/:id',
		component: 'productEdit',
	},
	{
		name: 'catalog.products.create',
		url: '/create',
		component: 'productCreate',
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
		name: 'catalog.collections.create',
		url: '/create',
		component: 'collectionCreate',
	},
	{
		name: 'catalog.collections.edit',
		url: '/:id',
		component: 'collectionEdit',
	},
	{
		name: 'catalog.manufacturers',
		url: '/manufacturers',
		abstract: true,
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
		name: 'catalog.pricesheets.edit',
		url: '/:id',
		component: 'pricesheetEdit',
	},
	{
		name: 'catalog.pricesheets.create',
		url: '/create',
		component: 'pricesheetCreate',
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
	/**
	 * Customers
	 */
	{
		name: 'customers',
		url: '/customers',
		abstract: true,
	},
	{
		name: 'customers.accounts',
		url: '/accounts',
		abstract: true,
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
		url: '/create',
		component: 'accountEdit',
	},
	{
		name: 'customers.groups',
		url: '/groups',
		abstract: true,
	},
	{
		name: 'customers.groups.edit',
		url: '/:id',
		component: 'groupEdit',
	},
	{
		name: 'customers.groups.create',
		url: '/create',
		component: 'groupCreate',
	},
	{
		name: 'customers.roles',
		url: '/roles',
		abstract: true,
		template: '<ui-view/>',
	},
	{
		name: 'customers.roles.create',
		url: '/create',
		component: 'rolePage',
	},
	{
		name: 'customers.roles.edit',
		url: '/:id',
		component: 'rolePage',
	},
	/**
	 * Email
	 */
	{
		name: 'email',
		url: '/email',
		component: 'emailPage',
	},
	/**
	 * Login
	 */
	{
		name: 'login',
		url: '/login',
		component: 'loginPage',
	},
	/**
	 * Orders
	 */
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
	/**
	 * Payments
	 */
	{
		name: 'payments',
		url: '/payments',
		component: 'paymentsPage',
		params: {
			activeTab: {
				dynamic: true,
			},
		},
	},
	/**
	 * Purchasing
	 */
	{
		name: 'purchasing',
		url: '/purchasing',
		abstract: true,
	},
	{
		name: 'purchasing.document-profiles',
		url: '/document-profiles',
		abstract: true,
	},
	{
		name: 'purchasing.document-profiles.create',
		url: '/create',
		component: 'documentProfilePage',
	},
	{
		name: 'purchasing.document-profiles.edit',
		url: '/:id',
		component: 'documentProfilePage',
	},
	{
		name: 'purchasing.cost-sheets',
		url: '/cost-sheets',
		abstract: true,
	},
	{
		name: 'purchasing.cost-sheets.index',
		url: '',
		component: 'purchasingCostSheets',
	},
	/**
	 * Reports
	 */
	{
		name: 'reports',
		url: '/reports',
		component: 'reportsPage',
		params: {
			activeTab: {
				dynamic: true,
			},
		},
	},
	/**
	 * Reset password
	 */
	{
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
	},
	/**
	 * Settings
	 */
	{
		name: 'settings',
		url: '/settings',
		component: 'settingsPage',
	},
	/**
	 * Shipping
	 */
	{
		name: 'shipping',
		url: '/shipping',
		abstract: true,
	},
	{
		name: 'shipping.rates',
		url: '/rates',
		abstract: true,
	},
	{
		name: 'shipping.rates.index',
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
	/**
	 * Taxes
	 */
	{
		name: 'taxes',
		url: '/taxes',
		component: 'taxesPage',
	},
];
