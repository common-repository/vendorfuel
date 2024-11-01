import angular from 'angular';
import { react2angular } from 'react2angular';
import { CollectionCreate } from './collection-create.component';
import { CollectionEdit } from './collection-edit.component';
import { searchModalFactory } from '../../../shared/modal/search-modal.factory';
import { ExportToGoogleShoppingButton } from './ExportToGoogleShoppingButton';

export const CollectionsModule = angular
	.module('CollectionsModule', [])
	.component('collectionCreate', CollectionCreate)
	.component('collectionEdit', CollectionEdit)
	.component(
		'exportToGoogleShoppingButton',
		react2angular(ExportToGoogleShoppingButton)
	).name;
