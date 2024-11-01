import angular from 'angular';
import { Layout } from './layout.component';

export const LayoutModule = angular
	.module('LayoutModule', [])
	.component('layoutComponent', Layout).name;
