import angular from 'angular';
import { ResetPasswordPage } from './reset-password-page.component';

export const ResetPasswordModule = angular
	.module('ResetPasswordModule', [])
	.component('resetPasswordPage', ResetPasswordPage).name;
