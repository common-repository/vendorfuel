import angular from 'angular';
import { ProductDetailImages } from './product-detail-images/product-detail-images.component';
import { ProductDetail } from './product-detail.component';
import { ProductSpecsValue } from './specs/product-specs-value.component';
import { ProductSpecs } from './specs/product-specs.component';

export const ProductDetailModule = angular
	.module('ProductDetailModule', [])
	.component('productDetail', ProductDetail)
	.component('productDetailImages', ProductDetailImages)
	.component('productSpecs', ProductSpecs)
	.component('productSpecsValue', ProductSpecsValue).name;
