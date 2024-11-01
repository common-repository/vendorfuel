import angular from 'angular';
import { react2angular } from 'react2angular';
import { RolePage } from './RolePage';

export const RolesModule = angular
	.module('RolesModule', [])
	.component('rolePage', react2angular(RolePage)).name;
