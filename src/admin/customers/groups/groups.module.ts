import angular from 'angular';
import { react2angular } from 'react2angular';
import { GroupCreate } from './group-create.component';
import { GroupEdit } from './group-edit.component';
import { searchModalFactory } from '../../shared/modal/search-modal.factory';
import { GroupTabs } from './GroupTabs';

export const GroupsModule = angular
	.module('GroupsModule', [])
	.component('groupCreate', GroupCreate)
	.component('groupEdit', GroupEdit)
	.component('groupTabs', react2angular(GroupTabs)).name;
