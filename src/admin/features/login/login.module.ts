import angular from 'angular';
import { LoginPage } from '../../pages/login';

export const LoginModule = angular
	.module('LoginModule', [])
	.component('loginPage', LoginPage).name;
