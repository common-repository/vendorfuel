import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-local-storage';
import uiMask from 'angular-ui-mask';

import { AccountModule } from './features/account/account.module';
import { CartModule } from './features/cart/cart.module';
import { CatalogModule } from './features/catalog/catalog.module';
import { CheckoutModule } from './checkout/checkout.module';
import { SearchModule } from './features/search/search.module';
import { WelcomeModule } from './features/welcome/welcome.module';

import { alertsService } from './services/alerts.service';
import { analyticsService } from './services/analytics.service';
import { authService } from './services/auth.service';
import { CheckoutService } from './services/checkout.service';
import { debugService } from './services/debug.service';
import { groupService } from './services/group.service';
import { localizedService } from './services/localized.service';
import { punchoutService } from './services/punchout.service';
import { userService } from './services/user.service';
import { utilsService } from './services/utils.service';
import { CollectionsFactory } from './factories/collections.factory';
import { interceptorFactory } from './factories/interceptor.factory';
import { productsFactory } from './factories/products.factory';
import { telFilter } from './filters/tel.filter';
import { LayoutModule } from './layout/layout.module';
import { ProductDetailModule } from './features/product-detail/product-detail.module';
import { PunchoutReturnModule } from './punchout-return/punchout-return.module';
import { PayfabricModule } from './components/payfabric-return/payfabric.module';
import { FavoritesModule } from './features/favorites/favorites.module';
import { OrdersModule } from './features/orders/orders.module';
import { SavedCartsModule } from './features/saved-carts/saved-carts.module';

export const PublicModule = angular
	.module('vfApp', [
		ngCookies,
		ngResource,
		ngSanitize,
		uiMask,
		'LocalStorageModule',
		AccountModule,
		CartModule,
		CatalogModule,
		CheckoutModule,
		FavoritesModule,
		LayoutModule,
		OrdersModule,
		PayfabricModule,
		ProductDetailModule,
		PunchoutReturnModule,
		SavedCartsModule,
		SearchModule,
		WelcomeModule,
	])
	.config([
		'$httpProvider',
		'localStorageServiceProvider',
		'$sceProvider',
		'$locationProvider',
		'uiMask.ConfigProvider',
		function (
			$httpProvider: ng.IHttpProvider,
			localStorageServiceProvider: ng.local.storage.ILocalStorageServiceProvider,
			$sceProvider: ng.ISCEProvider,
			$locationProvider: ng.ILocationProvider,
			uiMaskConfigProvider: any
		) {
			$httpProvider.interceptors.push('vfInterceptor');
			localStorageServiceProvider
				.setPrefix('vf')
				.setStorageCookie(0, '/', false)
				.setStorageType('sessionStorage');
			$sceProvider.enabled(false);
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false,
				rewriteLinks: false,
			});
			uiMaskConfigProvider.maskDefinitions({
				2: /[2-9]/,
				9: /\d/,
				A: /[a-zA-Z]/,
				'*': /[a-zA-Z0-9]/,
			});
		},
	])
	.service('Alerts', alertsService)
	.service('Analytics', analyticsService)
	.service('Auth', authService)
	.service('Checkout', CheckoutService)
	.service('Debug', debugService)
	.service('Group', groupService)
	.service('Localized', localizedService)
	.service('Punchout', punchoutService)
	.service('User', userService)
	.service('Utils', utilsService)
	.factory('Collections', CollectionsFactory)
	.factory('vfInterceptor', interceptorFactory)
	.factory('Products', productsFactory)
	.filter('tel', telFilter).name;
