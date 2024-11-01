import template from './cart-items.component.html';
declare const angular: ng.IAngularStatic;

/**
 * Cart Products List Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	angular
		.module( 'vfApp' )
		.component( 'cartItems', {
			template,
			bindings: {
				isLoading: '<',
				cart: '<',
			},
			require: {
				cartController: '^vfCart',
			},
			controller: CartItemsController,
		} );

	CartItemsController.$inject = [
		'Cart',
		'User',
		'Utils',
	];

	/**
	 * @param {Object} Cart  VendorFuel service
	 * @param {Object} User  VendorFuel service
	 * @param {Object} Utils VendorFuel service
	 */
	function CartItemsController(
		Cart,
		User,
		Utils,
	) {
		const vm = this;
		this.warningIcon = `${ localized.dir.url }public/images/warning.svg`;

		vm.$onInit = $onInit;
		vm.imgPlacerholder = '/wp-content/plugins/vendorfuel/assets/img/placeholder-150px.png';
		vm.remove = remove;
		vm.updateQty = updateQty;
		vm.updatingQty = [];

		/**
		 * Initialization
		 */
		function $onInit() {
			vm.isSignedIn = User.isAuthed && User.email;
			vm.pageUrls = {
				catalog: Utils.getPageUrl( 'catalog' ),
				login: Utils.getPageUrl( 'login' ),
				register: Utils.getPageUrl( 'register' ),
				savedCarts: Utils.getPageUrl( 'saved-carts' ),
			};
			vm.productSlug = localized.settings.general.product_slug || 'products';
		}

		/**
		 * @function $onChanges
		 * @param {Object} changes Object model changes.
		 */
		vm.$onChanges = ( changes ) => {
			if ( changes.cart && changes.cart.currentValue ) {
				jQuery( '.prop65-popover' ).popover( {
					html: true,
					placement: 'bottom',
					title: '<strong>WARNING: </strong>',
					trigger: 'click hover focus',
				} );

				for ( const item in vm.cart.items ) {
					if ( item ) {
						vm.cart.items[ item ].prop65Warning = getProp65Warning( vm.cart.items[ item ] );
					}
				}
			}
		};

		/**
		 * @function getProp65Warning
		 * @param {Object} item Product data.
		 * @return {string} Formatted Prop 65 warning.
		 */
		function getProp65Warning( item ) {
			if ( item.prop65 ) {
				let warning = item.prop65.warning;
				warning = warning.replace( /(^warning:)/gi, '' ).trim();
				warning = warning.replace( /(www.p65warnings.ca.gov)/gi,
					'<a href="https://$&" target="_blank">$&</a>' );
				return warning;
			}
			return null;
		}

		/**
		 * @function updateQty
		 * @param {number} qty       Quantity
		 * @param {number} productId Product ID
		 * @param {number} $index    Index
		 */
		function updateQty( qty, productId, $index ) {
			vm.updatingQty[ $index ] = true;
			Cart.update( qty, productId ).then( function( resp ) {
				vm.cartController.updateCart( resp.data );
				vm.updatingQty[ $index ] = false;
			} );
		}

		/**
		 * @param {number} productId Product ID
		 */
		function remove( productId ) {
			Cart.remove( productId )
				.then( function() {
					vm.cartController.getCart();
				} );
		}
	}
}() );
