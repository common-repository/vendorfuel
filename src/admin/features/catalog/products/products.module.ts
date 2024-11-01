import angular from 'angular';
import { react2angular } from 'react2angular';
import { ProductsService } from '../../../products/products.factory';
import { ProductEdit } from './edit';
import { ProductCreate } from './create';
import { ReviewsService } from '../../../products/reviews/reviews.factory';
import { ReviewsIndex } from '../../../products/reviews/reviews-index.component';
import { ReviewEdit } from '../../../products/reviews/review-edit.component';
import { CopyToNewProduct } from '../../../products/CopyToNewProduct';
import { ProductDetails } from '../../../products/ProductDetails';
import { ProductImages } from '../../../products/ProductImages';

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
