import angular from 'angular';
import { BannersModule } from './banners/banners.module';
import { CategoriesModule } from './categories/categories.module';
import { CollectionsModule } from './collections/collections.module';
import { PricesheetsModule } from './pricesheets/pricesheets.module';
import { ProductsModule } from './products/products.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';

export const CatalogModule = angular.module('CatalogModule', [
	BannersModule,
	CategoriesModule,
	CollectionsModule,
	PricesheetsModule,
	ProductsModule,
	PromoCodesModule,
]).name;
