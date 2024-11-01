declare let angular: ng.IAngularStatic;

import './cart.component';
import './cart-add-to-favorites.component';
import './cart-items.component';
import './cart-promo-code.component';
import './cart-summary.component';
import { CartRequestQuoteComponent } from './cart-request-quote/cart-request-quote.component';
import { CartDownloadCSVComponent } from './cart-download-csv/cart-download-csv.component';
import { CartOrderDetailsComponent } from './cart-order-details/cart-order-details.component';
import { CartSplitCheckoutComponent } from './cart-split-checkout/cart-split-checkout.component';

angular
	.module( 'vfApp' )
	.component( 'cartDownloadCsv', CartDownloadCSVComponent )
	.component( 'cartOrderDetails', CartOrderDetailsComponent )
	.component( 'cartRequestQuote', CartRequestQuoteComponent )
	.component( 'cartSplitCheckout', CartSplitCheckoutComponent );
