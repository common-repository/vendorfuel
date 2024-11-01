import angular from 'angular';
import { WelcomeComponent } from './welcome.component';

export const WelcomeModule = angular
	.module('WelcomeModule', [])
	.component('vfWelcome', WelcomeComponent).name;
