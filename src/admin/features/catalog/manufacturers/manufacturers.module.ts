declare const angular: ng.IAngularStatic;
import { ManufacturersService } from './manufacturers.factory';
import { ManufacturerEdit } from './manufacturers-edit.component';

export const ManufacturersModule = angular
	.module('ManufacturersModule', [])
	.factory('Manufacturers', ManufacturersService)
	.component('manufacturerEdit', ManufacturerEdit).name;
