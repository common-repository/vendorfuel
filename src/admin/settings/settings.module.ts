import angular from 'angular';
import { SettingsPage } from './settings-page.component';
import { SettingsMappingService } from './settings-mapping/settings-mapping.service';
import { SettingsMappingComponent } from './settings-mapping/settings-mapping.component';
import { SettingsPluginComponent } from './settings-plugin/settings-plugin.component';
import { SettingsAnalyticsComponent } from './settings-analytics/settings-analytics.component';
import { SettingsStoreComponent } from './settings-store/settings-store.component';

export const SettingsModule = angular
	.module('SettingsModule', [])
	.service('SettingsMappingService', SettingsMappingService)
	.component('settingsPage', SettingsPage)
	.component('settingsMapping', SettingsMappingComponent)
	.component('settingsPlugin', SettingsPluginComponent)
	.component('settingsAnalytics', SettingsAnalyticsComponent)
	.component('settingsStore', SettingsStoreComponent).name;
