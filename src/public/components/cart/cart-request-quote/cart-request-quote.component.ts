import template from './cart-request-quote.html';
import { emailPattern } from '../../../common/patterns';

export const CartRequestQuoteComponent: ng.IComponentOptions = {
	template,
	controller: class CartRequestQuoteController {
		static $inject: string[] = [ '$window', 'Cart' ];

		emailPattern = emailPattern;
		isLoading: boolean;
		isRequestingQuote: boolean;
		name: string;
		contact: string;

		// eslint-disable-next-line no-useless-constructor
		constructor(
			private $window: ng.IWindowService,
			private Cart: any,
		) {	}

		requestQuote() {
			this.isRequestingQuote = true;
		}

		submit() {
			this.isLoading = true;
			this.Cart.quote( this.name, this.contact )
				.then( ( response ) => response.data )
				.then( ( data ) => {
					if ( ! data.errors.length ) {
						this.isRequestingQuote = false;
					}
				} )
				.finally( () => {
					this.isLoading = false;
					this.$window.scrollTo( 0, 0 );
				} );
		}
	},
};
