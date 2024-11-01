import angular from 'angular';
import { AccountsModule } from './accounts/accounts.module';
import { GroupsModule } from '../../customers/groups/groups.module';
import { RolesModule } from './roles/roles.module';

export const CustomersModule = angular.module('CustomersModule', [
	AccountsModule,
	GroupsModule,
	RolesModule,
]).name;
