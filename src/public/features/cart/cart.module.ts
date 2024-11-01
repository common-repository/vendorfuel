import angular from 'angular';
import { cartService } from './cart.service';
import { CartRequestQuoteComponent } from './cart-request-quote/cart-request-quote.component';
import { CartDownloadCSVComponent } from './cart-download-csv/cart-download-csv.component';
import { CartOrderDetailsComponent } from './cart-order-details/cart-order-details.component';
import { CartSplitCheckoutComponent } from './cart-split-checkout/cart-split-checkout.component';
import { CartAddToFavorites } from './cart-add-to-favorites/cart-add-to-favorites.component';
import { CartItems } from './cart-items/cart-items.component';
import { CartPromoCode } from './cart-promo-code/cart-promo-code.component';
import { CartSummary } from './cart-summary/cart-summary.component';
import { CartComponent } from './cart.component';
import { CartMenu } from './cart-menu/cart-menu.component';
import { CartMenuDirective } from './cart-menu/cart-menu.directive';

export const CartModule = angular
	.module('CartModule', [])
	.component('cartAddToFavorites', CartAddToFavorites)
	.component('cartDownloadCsv', CartDownloadCSVComponent)
	.component('cartItems', CartItems)
	.component('cartOrderDetails', CartOrderDetailsComponent)
	.component('cartPromoCode', CartPromoCode)
	.component('cartRequestQuote', CartRequestQuoteComponent)
	.component('cartSplitCheckout', CartSplitCheckoutComponent)
	.component('cartSummary', CartSummary)
	.component('cartComponent', CartComponent)
	.component('vfCartMenu', CartMenu)
	.directive('vendorfuelCartMenu', CartMenuDirective)
	.service('Cart', cartService).name;
