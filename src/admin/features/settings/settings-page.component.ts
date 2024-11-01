import { toast } from 'react-toastify';
import template from './settings-page.component.html';

export const SettingsPage: ng.IComponentOptions = {
	controller,
	template,
};

controller.$inject = ['Admin', 'Localized', 'Settings'];

function controller(Admin: any, Localized: any, Settings: any) {
	this.$onInit = () => {
		this.activeTab = 0;
		this.isAuthed = Admin.Authed();
		this.isLoading = true;
		this.isSaved = false;
		this.isSaving = false;
		this.hasAPIKey = Localized.api_key;
		this.settings = Settings;
	};

	this.setActiveTab = (index: number): number => {
		return (this.activeTab = index);
	};

	/**
	 * @param {number} i Index
	 */
	this.showTab = (i: number) => {
		this.activeTab = i;
		Settings.errors = {};
		this.isLoading = true;
		this.isSaving = false;
		this.isSaved = false;
		switch (i) {
			case 0:
				getSettings(Settings.general);
				break;
			case 1:
				getSettings(Settings.store);
				break;
			case 2:
				getSettings(Settings.analytics);
				break;
			case 3:
				break;
		}
	};

	/**
	 * @param {number} i    Index
	 * @param {Object} form Form data
	 */
	this.submitUpdate = (i: number, form: any) => {
		switch (i) {
			case 0:
				this.updateGeneralSettings(form);
				break;
			case 1:
				updateStoreSettings(form);
				break;
			case 2:
				updateAnalyticsSettings(form);
				break;
			case 3:
				updateImageSettings(form);
				break;
		}
	};
	/**
	 * @param {Object} tab Settings
	 * @return {Object} Promise
	 */
	const getSettings = (tab: any) => {
		const promise = tab.Get().then(
			() => {
				this.isLoading = false;
			},
			() => {
				this.isLoading = false;
			}
		);
		return promise;
	};
	/**
	 * @param {Object} tab  Settings
	 * @param {Object} form Form data
	 * @return {Object} Promise
	 */
	const updateSettings = (tab: any, form: any) => {
		Settings.errors = {};
		this.isSaving = true;
		this.isSaved = false;
		const promise = tab.Set().then(
			() => {
				this.isSaving = false;
				this.isSaved = Object.keys(Settings.errors).length === 0;
				if (this.isSaved) {
					toast.info('Settings have been saved.');
				}

				form.$setPristine();
				form.$setUntouched();
			},
			() => {
				this.isSaving = false;
			}
		);
		return promise;
	};

	/**
	 * @param {Object} form Form data
	 */
	this.updateGeneralSettings = (form: any) => {
		if (
			this.settings.general.saved.api_url === '' ||
			this.settings.general.saved.api_key === ''
		) {
			Admin.Logout();
		}
		updateSettings(Settings.general, form);
	};

	/**
	 * @param {Object} form Form data
	 */
	const updateStoreSettings = (form: any) => {
		updateSettings(Settings.store, form);
	};

	/**
	 * @param {Object} form Form data
	 */
	const updateAnalyticsSettings = (form: any) => {
		updateSettings(Settings.analytics, form);
	};
	/**
	 * @param {Object} form Form data
	 */
	const updateImageSettings = (form: any) => {
		updateSettings(Settings.image, form);
	};
}
