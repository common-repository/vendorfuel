import angular from 'angular';
import './product-detail-alternate/product-detail-alternate-list.component';
import './product-detail-breadcrumb/product-detail-breadcrumb.component';
import './product-detail-favorite-button/product-detail-favorite-button.component';
import './product-detail-reviews/product-detail-reviews.component';
import './product-rating/product-rating.component';

import { ProductDocumentsComponent } from './product-documents/product-documents.component';
import { ProductRelatedComponent } from './product-related/product-related.component';

angular
	.module('vfApp')
	.component('productDocuments', ProductDocumentsComponent)
	.component('productRelated', ProductRelatedComponent);
