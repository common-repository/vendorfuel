import angular from 'angular';
import { AccountPage } from './account.component';
import { AccountMenu } from './account-menu.component';
import { AccountMenuDirective } from './account-menu.directive';

export const AccountModule = angular
	.module('AccountModule', [])
	.component('vfAccountMenu', AccountMenu)
	.component('vfAccount', AccountPage)
	.directive('vendorfuelAccountMenu', AccountMenuDirective).name;
