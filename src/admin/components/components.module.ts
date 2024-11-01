import angular from 'angular';
import { BsBadgeComponent } from './ui/bs-badge/bs-badge.component';
import { BsPaginationComponent } from './ui/bs-pagination/bs-pagination.component';
import { BsSearchBoxComponent } from './ui/bs-search-box/bs-search-box.component';
import { BsSearchBoxLegacyComponent } from './ui/bs-search-box-legacy/bs-search-box-legacy.component';
import { BsTableSortableComponent } from './table/bs-table-sortable/bs-table-sortable.component';
import { WpButtonComponent } from './ui/wp-button/wp-button.component';
import { WpFormFieldComponent } from './form/wp-form-field/wp-form-field.component';
import { VfCheckAuth } from './ui/vf-check-auth/vf-check-auth.component';
import { compileHtmlDirective } from './ui/compile-html.directive';
import { copyToClipboardDirective } from './ui/copy-to-clipboard.directive';
import { fileModelDirective } from './ui/file-model.directive';
import { formatDirective } from './ui/format.directive';
import { telFilter } from './ui/tel.filter';
import { Spinner } from './spinner/spinner.component';
import { NavTabWrapper } from './nav-tab-wrapper/nav-tab-wrapper.component';

export const ComponentsModule = angular
	.module('ComponentsModule', [])
	.component('spinnerComponent', Spinner)
	.component('bsBadge', BsBadgeComponent)
	.component('bsPagination', BsPaginationComponent)
	.component('bsSearchBox', BsSearchBoxComponent)
	.component('bsSearchBoxLegacy', BsSearchBoxLegacyComponent)
	.component('bsTableSortable', BsTableSortableComponent)
	.component('wpButton', WpButtonComponent)
	.component('wpFormField', WpFormFieldComponent)
	.component('vfCheckAuth', VfCheckAuth)
	.component('navTabWrapper', NavTabWrapper)
	.directive('compileHtml', compileHtmlDirective)
	.directive('copyToClipboard', copyToClipboardDirective)
	.directive('fileModel', fileModelDirective)
	.directive('format', formatDirective)
	.filter('tel', telFilter).name;
