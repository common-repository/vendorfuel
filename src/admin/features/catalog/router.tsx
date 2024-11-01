import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../../shared/Root';

import { CatalogPage } from '../../pages/catalog';
import { ErrorPage } from '../../pages/error';
import { CategoryIndex } from '../../pages/catalog/categories';
import { CategoryTreeCreate } from '../../pages/catalog/categories/tree/create';
import { CategoryTreeIndex } from '../../pages/catalog/categories/tree';
import { CategoryTreeShow } from '../../pages/catalog/categories/tree/show';
import { CategoryUploadIndex } from '../../pages/catalog/categories/uploads';
import { CategoryUploadCreate } from '../../pages/catalog/categories/uploads/create';
import { CategoryUploadShow } from '../../pages/catalog/categories/uploads/show';
import { PricesheetIndex } from '../../pages/catalog/pricesheets';
import { PricesheetUploadIndex } from '../../pages/catalog/pricesheets/uploads';
import { PricesheetUploadCreate } from '../../pages/catalog/pricesheets/uploads/create';
import { PricesheetUploadShow } from '../../pages/catalog/pricesheets/uploads/show';
import { ProductIndex } from '../../pages/catalog/products';
import { ProductUploadCreate } from '../../pages/catalog/products/uploads/create';
import { ProductUploadShow } from '../../pages/catalog/products/uploads/show';
import { ProductUploadIndex } from '../../pages/catalog/products/uploads';
import { CollectionIndex } from '../../pages/catalog/collections';
import { ManufacturerIndex } from '../../pages/catalog/manufacturers';
import { ManufacturerEdit } from '../../pages/catalog/manufacturers/edit';
import { ExportIndex } from '../../pages/catalog/products/exports';
import { InventoryUploadCreate } from '../../pages/catalog/products/inventory';
import { ExportCreate } from '../../pages/catalog/products/exports/create';
import { ProductUtilities } from '../../pages/catalog/products/utilities';
import { CategoryUtilities } from '../../pages/catalog/categories/utilities';

export const router = createHashRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />} errorElement={<ErrorPage />}>
			<Route path="" element={<CatalogPage />}></Route>
			<Route path="categories">
				<Route index element={<CategoryIndex />}></Route>
				<Route path="uploads">
					<Route index element={<CategoryUploadIndex />}></Route>
					<Route
						path="create"
						element={<CategoryUploadCreate />}
					></Route>
					<Route path=":id" element={<CategoryUploadShow />}></Route>
				</Route>
				<Route path="tree">
					<Route index element={<CategoryTreeIndex />}></Route>
					<Route
						path="create"
						element={<CategoryTreeCreate />}
					></Route>
					<Route path=":id" element={<CategoryTreeShow />}></Route>
				</Route>
				<Route path="utilities" element={<CategoryUtilities />}></Route>
			</Route>
			<Route path="collections">
				<Route index element={<CollectionIndex />}></Route>
			</Route>
			<Route path="manufacturers">
				<Route index element={<ManufacturerIndex />}></Route>
				<Route path="create" element={<ManufacturerEdit />}></Route>
				<Route path=":id" element={<ManufacturerEdit />}></Route>
			</Route>
			<Route path="products">
				<Route index element={<ProductIndex />}></Route>
				<Route path="uploads">
					<Route index element={<ProductUploadIndex />}></Route>
					<Route
						path="create"
						element={<ProductUploadCreate />}
					></Route>
					<Route path=":id" element={<ProductUploadShow />}></Route>
				</Route>
				<Route
					path="inventory"
					element={<InventoryUploadCreate />}
				></Route>
				<Route path="exports">
					<Route index element={<ExportIndex />}></Route>
					<Route path="create" element={<ExportCreate />}></Route>
				</Route>
				<Route path="utilities" element={<ProductUtilities />}></Route>
			</Route>
			<Route path="pricesheets">
				<Route index element={<PricesheetIndex />}></Route>
				<Route path="uploads">
					<Route index element={<PricesheetUploadIndex />}></Route>
					<Route
						path="create"
						element={<PricesheetUploadCreate />}
					></Route>
					<Route
						path=":id"
						element={<PricesheetUploadShow />}
					></Route>
				</Route>
			</Route>
		</Route>
	)
);
