import template from './tutorial.component.html';

/**
 * Tutorial Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	angular
		.module( 'vendorfuelApp' )
		.component( 'vfTutorial', {
			controller: TutorialController,
			template,
		} );

	TutorialController.$inject = [
		'$rootScope',
		'$state',
		'$window',
		'Admin',
		'Localized',
		'Utils',
	];

	/**
	 * @param {Object} $rootScope AngularJS service
	 * @param {Object} $state     UI Router service
	 * @param {Object} $window    AngularJS service
	 * @param {Object} Admin      VendorFuel service
	 * @param {Object} Localized  VendorFuel service
	 * @param {Object} Utils      VendorFuel service
	 */
	function TutorialController(
		$rootScope: any,
		$state: ng.ui.IStateService,
		$window: ng.IWindowService,
		Admin: any,
		Localized: any,
		Utils: any,
	) {
		const vm = this;
		vm.goToState = goToState;
		vm.toggle = toggle;

		/**
		 * Initialization
		 */
		this.$onInit = () => {
			this.breadcrumbs = [ { name: 'Tutorial', state: null } ];
			vm.isAuthed = Admin.Authed();
			// @ts-ignore
			vm.isShowingTutorial = $window.localStorage.getItem( 'showTutorial' ) === true || $window.localStorage.getItem( 'showTutorial' ) === 'true' ? true : false;
			vm.isHidingTutorial = ! vm.isShowingTutorial;

			if ( ! Admin.Authed() ) {
				if ( Localized.api_key ) {
					Utils.setLocation( '/login', true );
				} else {
					Utils.setLocation( '/settings', true );
				}
			}
		};

		/**
		 * @param {string} stateName State name
		 * @param {number} tabIndex  Index
		 * @param {Object} event     Click event
		 */
		function goToState( stateName: string, tabIndex: number, event: Event ) {
			event.preventDefault();
			$window.scrollTo( {
				top: 0,
				left: 0,
				behavior: 'smooth',
			} );
			$state.go( stateName, { activeTab: tabIndex } );
		}

		/**
		 * @param {string} key Key
		 */
		function toggle( key: string ) {
			// @ts-ignore
			const value = $window.localStorage.getItem( key ) === true || $window.localStorage.getItem( key ) === 'true' ? true : false;
			// @ts-ignore
			$window.localStorage.setItem( key, ! value );
		}
	}
}() );
