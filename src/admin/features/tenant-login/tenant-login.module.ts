import angular from 'angular';
import { TenantLoginPage } from './tenant-login-page.component';

export const TenantLoginModule = angular
	.module('TenantLoginModule', [])
	.component('tenantLoginPage', TenantLoginPage).name;
