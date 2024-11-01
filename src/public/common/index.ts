import angular from 'angular';
import './wordpress';

import './alert-list.component';
import './bs-breadcrumb.component';
import './bs-spinner.component';
import './helper.component';
import './search.component';
import '../features/search/search-bar.component';
import './spinner.component';
import './tel.filter';
import './us-states.constant';
import './product-list/product-list-item.component';
import './product-list/product-list-item-favorite-button.component';
import './product-list/product-list-item-image.component';

import SelectGroupComponent from './select-group/select-group.component';

angular.module('vfApp').component('selectGroup', SelectGroupComponent);
