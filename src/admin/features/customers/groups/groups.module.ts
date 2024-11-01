import angular from 'angular';
import { react2angular } from 'react2angular';
import { GroupCreate } from '../../../pages/customers/groups/create';
import { GroupEdit } from '../../../pages/customers/groups/edit';
import { GroupTabs } from './group-tabs';

export const GroupsModule = angular
	.module('GroupsModule', [])
	.component('groupCreate', GroupCreate)
	.component('groupEdit', GroupEdit)
	.component('groupTabs', react2angular(GroupTabs)).name;
