import angular from 'angular';
import { SavedCarts } from '.';

export const SavedCartsModule = angular
	.module('SavedCartsModule', [])
	.component('vfSavedCarts', SavedCarts).name;
