import angular from 'angular';
import { PunchoutReturn } from './punchout-return.component';

export const PunchoutReturnModule = angular
	.module('PunchoutReturnModule', [])
	.component('punchoutReturn', PunchoutReturn).name;
