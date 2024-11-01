/**
 * Cart Widget Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	const template = `
		<div class="d-flex py-3 justify-content-center"
			ng-show="$ctrl.isInProgress">
			<div class="spinner-border" role="status">
				<span class="sr-only">Loading...</span>
			</div>
		</div>
		<div ng-show="!$ctrl.isInProgress">
			<h6 class="d-flex justify-content-between align-items-center">
				<ng-pluralize count="$ctrl.cartQty"
					when="{'0': 'No items in your cart.',
						'one': 'One item in your cart.',
						'other': '{} items in your cart.'}">
				</ng-pluralize>
				<span class="badge badge-success ml-2"
					ng-if="$ctrl.totalAmount > 0 && $ctrl.cartQty">
					Total: {{$ctrl.totalAmount | currency }}
				</span>
			</h6>
			<div class="list-group mb-2"
				ng-if="$ctrl.cartQty">
				<a class="list-group-item list-group-item-action"
					ng-attr-title="View {{item.description}}"
					ng-repeat="item in $ctrl.cartItems track by $index"
					ng-href="/{{$ctrl.productSlug}}/{{item.slug}}">

					<div class="text-truncate">
						{{item.description}}
					</div>
					<div class="d-flex w-100 justify-content-between align-items-center small">
						{{item.price | currency}}{{ item.uom ? '/' + item.uom : '' }}<br>
						<span>Qty: {{item.qty}}</span>
					</div>
				</a>
			</div>			
		</div>
		<div ng-if="$ctrl.cartQty > 0">
			<a class="btn btn-primary btn-block" title="Go to Cart"
				ng-href="{{$ctrl.pageUrls.cart}}">
				<i class="bi bi-cart-fill"></i>
				Go to Cart
			</a>
		</div>
	`;

	angular
		.module( 'vfApp' )
		.component( 'cartWidget', {
			controller: CartWidgetController,
			template,
		} );

	CartWidgetController.$inject = [
		'Cart',
		'Utils',
		'User',
	];

	/**
	 * @param {Object} Cart  VendorFuel service
	 * @param {Object} Utils VendorFuel service
	 * @param {Object} User  VendorFuel service
	 */
	function CartWidgetController(
		Cart,
		Utils,
		User,
	) {
		const vm = this;
		vm.$doCheck = $doCheck;
		vm.$onInit = $onInit;
		vm.cartQty = getCartQuantity();
		vm.productSlug = localized.settings.general.product_slug || 'products';

		/**
		 * @name $onInit	{@link https://docs.angularjs.org/api/ng/service/$compile#life-cycle-hooks}
		 * @memberof Components.CartMenuDropdownController
		 */
		function $onInit() {
			vm.pageUrls = {
				cart: Utils.getPageUrl( 'cart' ),
				checkout: Utils.getPageUrl( 'checkout' ),
			};
			if ( User.isAuthed ) {
				getCartDetails();
			}
		}

		/**
		 * @name $doCheck	{@link https://docs.angularjs.org/api/ng/service/$compile#life-cycle-hooks}
		 * @memberof Components.CartMenuDropdownController
		 */
		function $doCheck() {
			if ( User.isAuthed && vm.cartQty !== getCartQuantity() ) {
				vm.cartQty = getCartQuantity();
				getCartDetails();
			}
		}

		/**
		 * @name getCartDetails
		 * @memberof Components.CartMenuDropdownController
		 */
		function getCartDetails() {
			vm.isInProgress = true;
			Cart.fillDetails()
				.then( ( resolve ) => {
					if ( resolve.data.cart ) {
						vm.cartItems = getCartItems( resolve.data.cart.items );
						vm.totalAmount = Number( resolve.data.cart.total_amount );
					}
				} )
				.catch( ( reject ) => {
					console.error( reject );
				} )
				.finally( () => {
					vm.isInProgress = false;
				} );
		}

		/**
		 * @name getCartItems
		 * @param {Object} items Items in cart.
		 * @return {Array} Items in cart.
		 */
		function getCartItems( items ) {
			const cartItems = [];
			for ( const key in items ) {
				if ( key ) {
					const item = items[ key ];
					item.price = Number( item.price );
					cartItems.push( item );
				}
			}
			return cartItems;
		}

		/**
		 * @name getCartQuantity
		 * @memberof Components.CartMenuDropdownController
		 * @return {number} Total items in cart.
		 */
		function getCartQuantity() {
			let quantity = 0;
			for ( const item in Cart.items ) {
				if ( item ) {
					quantity = quantity + Cart.items[ item ];
				}
			}
			return quantity;
		}
	}
}() );
