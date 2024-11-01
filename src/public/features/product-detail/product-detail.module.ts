import angular from 'angular';
import { ProductDetailImages } from '../../product-detail/product-detail-images/product-detail-images.component';
import { ProductDetail } from './product-detail.component';
import { ProductSpecsValue } from '../../product-detail/specs/product-specs-value.component';
import { ProductSpecs } from '../../product-detail/specs/product-specs.component';
import { ProductMetadata } from './product-metadata.component';

export const ProductDetailModule = angular
	.module('ProductDetailModule', [])
	.component('productDetail', ProductDetail)
	.component('productDetailImages', ProductDetailImages)
	.component('productMetadata', ProductMetadata)
	.component('productSpecs', ProductSpecs)
	.component('productSpecsValue', ProductSpecsValue).name;
