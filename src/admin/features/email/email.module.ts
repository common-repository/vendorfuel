import angular from 'angular';
import { EmailPageComponent } from './email-page.component';

export const EmailModule = angular
	.module('EmailModule', [])
	.component('emailPage', EmailPageComponent).name;
