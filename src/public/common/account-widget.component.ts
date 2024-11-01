/**
 * Account Widget Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	const template = `
		<div ng-if="$ctrl.isSignedIn">
			<h6>
				{{ 'Hello, ' + $ctrl.firstName }}
			</h6>
			<ul class="nav flex-column">
				<li class="nav-item">
					<a class="nav-link"
						ng-href="{{$ctrl.pageUrls.account}}">
						<i class="bi bi-person-circle mr-1"></i>
						Account
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link"
						ng-href="{{$ctrl.pageUrls.addresses}}">
						<i class="bi bi-people-fill mr-1"></i>
						Address Profiles
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link"
						ng-href="{{$ctrl.pageUrls.savedCarts}}">
						<i class="bi bi-cart-check-fill mr-1"></i>
						Saved Carts
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link"
						ng-href="{{$ctrl.pageUrls.favorites}}">
						<i class="bi bi-heart-fill mr-1"></i>
						Favorites
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link"
						ng-href="{{$ctrl.pageUrls.orders}}">
						<i class="bi bi-box-seam mr-1"></i>
						Orders
					</a>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link"
						ng-click="$ctrl.logout($event)">
						<i class="bi bi-box-arrow-right"
							ng-hide="$ctrl.isSigningOut"></i>
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
							ng-show="$ctrl.isSigningOut"></span>
						{{ $ctrl.isSigningOut ? 'Signing' : 'Sign' }} Out
					</a>
				</li>
			</ul>			
		</div>			
		<div ng-if="!$ctrl.isSignedIn">	
			<form name="loginForm" id="loginForm" autocomplete="on">
				<div class="alert alert-warning"
					ng-show="$ctrl.alert">
					{{$ctrl.alert}}
				</div>
				<div class="form-group">
					<label for="inputEmail">Email</label>
					<input type="email" id="inputEmail" name="email"
						placeholder="Login Email" required
						ng-class="['form-control form-control-sm', {
							'is-valid':loginForm.email.$valid,
							'is-invalid':loginForm.email.$invalid && loginForm.email.$touched
						}]"
						ng-model="$ctrl.customer.email" />
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<div class="input-group input-group-sm">
						<input type="password" name="password" id="password"
							placeholder="Password" data-toggle="password" required
							ng-model="$ctrl.customer.password"
							ng-attr-type="{{$ctrl.isShowingPassword ? 'text':'password'}}"
							ng-class="['form-control', {
								'is-valid':loginForm.password.$valid,
								'is-invalid':loginForm.password.$invalid && loginForm.password.$touched
							}]" />
						<div class="input-group-append">
							<button class="btn btn-secondary" type="button" aria-label="Show password"
								ng-click="$ctrl.isShowingPassword = !$ctrl.isShowingPassword">
								<i ng-class="['bi', {'bi-eye-fill': $ctrl.isShowingPassword,
									'bi-eye-slash-fill': !$ctrl.isShowingPassword}]"></i>
							</button>							
						</div>
					</div>
				</div>								
				<div class="form-check my-2">
					<input class="form-check-input" type="checkbox" value="" id="remember-me"
						ng-model="$ctrl.customer.remember">
					<label class="form-check-label" for="remember-me">Remember me</label>
				</div>
				<button class="btn btn-primary btn-block my-2" type="submit" autofocus
					ng-focus="$ctrl.customer.email.length > 0 && $ctrl.customer.password.length > 0"
					ng-click="$ctrl.login()">
					<i class="bi bi-box-arrow-in-right"
						ng-hide="$ctrl.isSigningIn"></i>
					<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
						ng-show="$ctrl.isSigningIn"></span>
					{{ $ctrl.isSigningIn ? 'Signing In' : 'Sign In' }}
				</button>
			</form>
			<a class="btn btn-link btn-sm btn-block"
				ng-href="{{ $ctrl.pageUrls.forgotPassword }}">
				Forgot Password?
			</a>								
			<a class="btn btn-link btn-sm btn-block"
				ng-href="{{ $ctrl.pageUrls.register }}">
				Create an account
			</a>								
		</div>			
	`;

	angular
		.module( 'vfApp' )
		.component( 'accountWidget', {
			controller: AccountWidgetController,
			template,
		} );

	AccountWidgetController.$inject = [
		'$cookies',
		'$rootScope',
		'User',
		'Utils',
	];

	/**
	 * @function
	 * @param {$cookies}   $cookies   - cookies service
	 * @param {$rootScope} $rootScope - rootScope of vfApp
	 * @param {User}       User       - User service
	 * @param {Utils}      Utils      - Utilities service
	 */
	function AccountWidgetController(
		$cookies,
		$rootScope,
		User,
		Utils,
	) {
		const vm = this;
		vm.$onInit = $onInit;
		vm.alert = '';
		vm.customer = {};
		vm.isSigningIn = false;
		vm.isSigningOut = false;
		vm.login = login;
		vm.logout = logout;
		vm.isShowingPassword = false;
		vm.toggleShowPassword = toggleShowPassword;
		vm.pageUrls = {
			addresses: Utils.getPageUrl( 'addresses' ),
			account: Utils.getPageUrl( 'account' ),
			savedCarts: Utils.getPageUrl( 'saved-carts' ),
			favorites: Utils.getPageUrl( 'favorites' ),
			forgotPassword: Utils.getPageUrl( 'forgot-password' ),
			orders: Utils.getPageUrl( 'orders' ),
			register: Utils.getPageUrl( 'register' ),
		};

		/**
		 * @name $onInit
		 */
		function $onInit() {
			vm.isSignedIn = User.isAuthed && User.email;
			vm.userName = User.name || null;
			vm.firstName = User.name ? getFirstName( User.name ) : null;
		}

		/**
		 * @name getFirstName
		 * @param {string} name - The full name
		 * @return {string} First name.
		 */
		function getFirstName( name ) {
			const space = ' ';
			if ( name.includes( space ) ) {
				return name.substr( 0, name.indexOf( space ) );
			}
			return name;
		}

		/**
		 * @name login
		 */
		function login() {
			if ( vm.customer.email && vm.customer.password ) {
				vm.isSigningIn = true;
				User.login( vm.customer )
					.then( function( resp ) {
						if ( resp.data.errors.length ) {
							vm.alert = resp.data.errors.join( '. ' );
						} else {
							checkPunchout();
							vm.isSignedIn = true;
							vm.userName = resp.data.name;
							vm.firstName = getFirstName( resp.data.name );
						}
						vm.isSigningIn = false;
					}, function( errResp ) {
						vm.customer.errors = errResp.data.errors;
						if ( errResp.data.errors.length > 0 ) {
							vm.alert = vm.customer.error.join( '. ' );
						}
						vm.isSigningIn = false;
					} );
			} else {
				vm.isSigningIn = false;
				vm.alert = 'Your username or password is blank. Please fill out both fields.';
			}
		}

		/**
		 * @name checkPunchout
		 */
		function checkPunchout() {
			if ( User.punchoutOnly ) {
				Utils.goToPage( Utils.getPageUrl( 'welcome' ) );
			}
		}

		/**
		 * @name logout
		 * @param {event} event -the browser event object
		 */
		function logout( event ) {
			event.preventDefault();
			vm.isSigningOut = true;
			User.logout()
				.then( function() {
					window.location.href = '/';
				} );
		}

		/**
		 * @function toggleShowPassword
		 */
		function toggleShowPassword() {
			vm.showPassword = ! vm.showPassword;
		}
	}
}() );
