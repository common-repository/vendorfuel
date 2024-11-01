import angular from 'angular';
import { react2angular } from 'react2angular';
import { ProductsService } from './products.factory';
import { ProductEdit } from './product-edit.component';
import { ProductCreate } from './product-create.component';
import { ReviewsService } from './reviews/reviews.factory';
import { ReviewsIndex } from './reviews/reviews-index.component';
import { ReviewEdit } from './reviews/review-edit.component';
import { searchModalFactory } from '../shared/modal/search-modal.factory';
import { CopyToNewProduct } from './CopyToNewProduct';
import { ProductDetails } from './ProductDetails';
import { ProductImages } from './ProductImages';

export const ProductsModule = angular
	.module('ProductsModule', [])
	.factory('Reviews', ReviewsService)
	.factory('Products', ProductsService)
	.component('productEdit', ProductEdit)
	.component('productCreate', ProductCreate)
	.component('reviewsIndex', ReviewsIndex)
	.component('reviewEdit', ReviewEdit)
	.component('copyToNewProduct', react2angular(CopyToNewProduct))
	.component('productDetails', react2angular(ProductDetails))
	.component('productImages', react2angular(ProductImages)).name;
