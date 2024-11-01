import template from './settings.component.html';

/**
 * Settings Component
 *
 * @namespace Components
 */
( function() {
	'use strict';

	angular
		.module( 'SettingsModule' )
		.component( 'vfSettings', {
			controller: SettingsController,
			template,
		} );

	SettingsController.$inject = [
		'$window',
		'Admin',
		'Localized',
		'Settings',
	];

	/**
	 * @param {Object} $window   AngularJS service
	 * @param {Object} Admin     VendorFuel service
	 * @param {Object} Localized VendorFuel service
	 * @param {Object} Settings  VendorFuel service
	 */
	function SettingsController(
		$window: ng.IWindowService,
		Admin: any,
		Localized: any,
		Settings: any,
	) {
		const vm = this;
		vm.resetTutorial = resetTutorial;

		/**
		 * Initialization
		 */
		this.$onInit = () => {
			this.breadcrumbs = [
				{ name: 'Settings', state: 'settings' },
			];
			vm.activeTab = 0;
			vm.isAuthed = Admin.Authed();
			vm.isLoading = true;
			vm.isSaved = false;
			vm.isSaving = false;
			vm.hasAPIKey = Localized.api_key;
			vm.settings = Settings;
		};

		/**
		 */
		function resetTutorial() {
			vm.isResettingTutorial = true;
			Settings.resetTutorial()
				.then( function() {
					vm.isResettingTutorial = false;
					$window.scrollTo( {
						top: 0,
						left: 0,
						behavior: 'smooth',
					} );
				} );
		}

		this.setActiveTab = ( index: number ): number => {
			return this.activeTab = index;
		};

		/**
		 * @param {number} i Index
		 */
		this.showTab = ( i: number ) => {
			vm.activeTab = i;
			Settings.errors = {};
			vm.isLoading = true;
			vm.isSaving = false;
			vm.isSaved = false;
			switch ( i ) {
				case 0:
					getSettings( Settings.general );
					break;
				case 1:
					getSettings( Settings.store );
					break;
				case 2:
					getSettings( Settings.analytics );
					break;
				case 3:
					break;
			}
		};

		/**
		 * @param {number} i    Index
		 * @param {Object} form Form data
		 */
		this.submitUpdate = ( i: number, form: any ) => {
			switch ( i ) {
				case 0:
					this.updateGeneralSettings( form );
					break;
				case 1:
					updateStoreSettings( form );
					break;
				case 2:
					updateAnalyticsSettings( form );
					break;
				case 3:
					updateImageSettings( form );
					break;
			}
		};
		/**
		 * @param {Object} tab Settings
		 * @return {Object} Promise
		 */
		function getSettings( tab: any ) {
			const promise = tab.Get()
				.then( () => {
					vm.isLoading = false;
				}, function errorCallback() {
					vm.isLoading = false;
				} );
			return promise;
		}
		/**
		 * @param {Object} tab  Settings
		 * @param {Object} form Form data
		 * @return {Object} Promise
		 */
		function updateSettings( tab: any, form: any ) {
			Settings.errors = {};
			vm.isSaving = true;
			vm.isSaved = false;
			const promise = tab.Set()
				.then( function successCallback() {
					vm.isSaving = false;
					vm.isSaved = Object.keys( Settings.errors ).length === 0;
					if ( vm.isSaved ) {
						Localized.setNotification( {
							type: 'success',
							message: 'Settings have been saved.',
						} );
						$window.scrollTo( {
							top: 0,
							left: 0,
							behavior: 'smooth',
						} );
					}

					form.$setPristine();
					form.$setUntouched();
				}, function errorCallback() {
					vm.isSaving = false;
				} );
			return promise;
		}

		/**
		 * @param {Object} form Form data
		 */
		this.updateGeneralSettings = ( form: any ) => {
			if ( vm.settings.general.saved.api_url === '' || vm.settings.general.saved.api_key === '' ) {
				Admin.Logout();
			}
			updateSettings( Settings.general, form );
		};

		/**
		 * @param {Object} form Form data
		 */
		function updateStoreSettings( form: any ) {
			updateSettings( Settings.store, form );
		}

		/**
		 * @param {Object} form Form data
		 */
		function updateAnalyticsSettings( form: any ) {
			updateSettings( Settings.analytics, form );
		}
		/**
		 * @param {Object} form Form data
		 */
		function updateImageSettings( form: any ) {
			updateSettings( Settings.image, form );
		}
	}
}() );
