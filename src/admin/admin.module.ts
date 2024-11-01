import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngTouch from 'angular-touch';
import uiRouter from '@uirouter/angularjs';
import uiMask from 'angular-ui-mask';
import 'ui-bootstrap4';
import 'angular-ui-tinymce';
import 'angular-local-storage';
import 'angular-toarrayfilter';
import { react2angular } from 'react2angular';

import { ComponentsModule } from './components/components.module';
import { ServicesModule } from './services/services.module';
import { AdminAccountsModule } from './features/users/admin-accounts.module';
import { CatalogModule } from './features/catalog/catalog.module';
import { CustomersModule } from './features/customers/customers.module';
import { EmailModule } from './features/email/email.module';
import { LoginModule } from './login/login.module';
import { OrdersModule } from './features/orders/orders.module';
import { PaymentsModule } from './features/payments/payments.module';
import { PurchasingModule } from './features/purchasing/purchasing.module';
import { ReportsModule } from './reports/reports.module';
import { ResetPasswordModule } from './features/reset-password/reset-password.module';
import { SettingsModule } from './settings/settings.module';
import { ShippingModule } from './features/shipping/shipping.module';
import { TaxesModule } from './features/taxes/taxes.module';
import { configStates } from './shared/configStates';
import { Toasts } from './shared/Toasts';
import { NavBar } from './shared/NavBar';
import type { Localized } from './types';
import { LayoutModule } from './layout/layout.module';
import { Breadcrumb } from './components/breadcrumb/breadcrumb.component';
import { PageHeading } from './components/page-heading/page-heading.component';
import { SharedModule } from './shared/shared.module';
declare const localized: Localized;

export const AdminModule = angular
	.module('vendorfuelApp', [
		ngAnimate,
		ngCookies,
		ngResource,
		ngSanitize,
		ngTouch,
		uiRouter,
		uiMask,
		'ui.bootstrap',
		'ui.tinymce',
		'LocalStorageModule',
		'angular-toArrayFilter',
		ServicesModule,
		AdminAccountsModule,
		CatalogModule,
		ComponentsModule,
		CustomersModule,
		EmailModule,
		LayoutModule,
		LoginModule,
		OrdersModule,
		PaymentsModule,
		PurchasingModule,
		ReportsModule,
		ResetPasswordModule,
		SettingsModule,
		SharedModule,
		ShippingModule,
		TaxesModule,
	])
	.config([
		'$httpProvider',
		'$sceDelegateProvider',
		'$stateProvider',
		'$urlRouterProvider',
		'localStorageServiceProvider',
		'uiMask.ConfigProvider',
		function (
			$httpProvider: ng.IHttpProvider,
			$sceDelegateProvider: ng.ISCEDelegateProvider,
			$stateProvider: ng.ui.IStateProvider,
			$urlRouterProvider: ng.ui.IUrlRouterProvider,
			localStorageServiceProvider: ng.local.storage.ILocalStorageServiceProvider,
			uiMaskConfigProvider
		) {
			$httpProvider.interceptors.push('vfAdminInterceptor');

			localStorageServiceProvider
				.setPrefix('vf')
				.setStorageCookie(0, '/', false)
				.setStorageType('sessionStorage');

			$sceDelegateProvider.resourceUrlWhitelist([
				// Allow same origin resource loads.
				'self',
				// Allow loading from our assets domain.  Notice the difference between * and **.
				'https://*.payfabric.com/**',
			]);

			uiMaskConfigProvider.maskDefinitions({
				2: /[2-9]/,
				9: /\d/,
				A: /[a-zA-Z]/,
				'*': /[a-zA-Z0-9]/,
			});

			configStates($stateProvider, $urlRouterProvider);
		},
	])
	.run([
		'$location',
		'$transitions',
		'Admin',
		($location: ng.ILocationService, $transitions: any, Admin: any) => {
			if (!localized.settings.general.api_key) {
				if (Admin.authed) {
					Admin.Logout();
				}
				$location.path('/settings');
			}

			// Scroll to top of page on router transitions.
			$transitions.onSuccess({}, () => {
				document.body.scrollTop =
					document.documentElement.scrollTop = 0;
			});
		},
	])
	.component('vendorfuelToasts', react2angular(Toasts))
	.component('navBar', react2angular(NavBar))
	.component('breadcrumbComponent', Breadcrumb)
	.component('pageHeadingComponent', PageHeading).name;
