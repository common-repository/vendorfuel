import angular from 'angular';
import { CategoryCreate } from './category-create.component';
import { CategoryEdit } from './category-edit.component';

export const CategoriesModule = angular
	.module('CategoriesModule', [])
	.component('categoryCreate', CategoryCreate)
	.component('categoryEdit', CategoryEdit).name;
