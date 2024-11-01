import angular from 'angular';
import { LoginPage } from './login-page.component';

export const LoginModule = angular
	.module('LoginModule', [])
	.component('loginPage', LoginPage).name;
