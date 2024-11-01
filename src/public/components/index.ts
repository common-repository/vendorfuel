import angular from 'angular';
import '../features/account/account.component';
import './addresses';
import './catalog/catalog-breadcrumb/catalog-breadcrumb.component';
import './catalog/catalog-current-refinements/catalog-current-refinements-list.component';
import './catalog/catalog-pagination/catalog-pagination.component';
import './catalog/catalog-product-list/catalog-product-list.component';
import './catalog/catalog-search/catalog-search.component';
import './catalog/catalog-sort-by/catalog-sort-by.component';
import './catalog/catalog-view-toggle/catalog-view-toggle.component';
import './checkout';
import './collection/collection.component';
import './collection/collection-carousel.component';
import './collection/collection-category-list.component';
import './collection/collection-category-list-item.component';
import './collection/collection-favorite-button.component';
import './collection/collection-gallery.component';
import './collection/collection-gallery-item.component';
import './collection/collection-image.component';
import './collection/collection-pagination.component';
import './collection/collection-product-list.component';
import './collection/collection-product-list-item.component';
import './group-orders';
import './home/home.component';
import './login/login.component';
import './order-by-sku/order-by-sku-search.component';
import './orders';
import './payfabric-return/payfabric-return.component';
import './product-card/product-card.component';
import './product-detail';
import './punchout';
import './register/register.component';
import './reset-password/reset-password.component';
import './saved-cart/saved-cart.component';
import './saved-cart/saved-cart-add-to-cart.component';
import './saved-cart/saved-cart-item.component';
import './saved-cart/saved-cart-toggle-favorite.component';
import './view-order/view-order.component';
import './welcome';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GroupAccountComponent } from './group-account/group-account.component';
import { OrderBySkuComponent } from './order-by-sku/order-by-sku.component';
import { PriceAvailabilityComponent } from './price-availability/price-availability.component';
import { SidebarAccountLinkComponent } from './sidebar-account-link/sidebar-account-link.component';
import { SidebarCategoryMenuComponent } from './sidebar-category-menu/sidebar-category-menu.component';

angular
	.module('vfApp')
	.component('forgotPassword', ForgotPasswordComponent)
	.component('groupAccount', GroupAccountComponent)
	.component('orderBySku', OrderBySkuComponent)
	.component('priceAvailability', PriceAvailabilityComponent)
	.component('sidebarAccountLink', SidebarAccountLinkComponent)
	.component('sidebarCategoryMenu', SidebarCategoryMenuComponent);
