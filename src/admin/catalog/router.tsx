import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../shared/Root';

import { CatalogPage } from './CatalogPage';
import { ErrorPage } from '../shared/ErrorPage';
import { CategoryIndex } from './categories/CategoryIndex';
import { CategoryTreeCreate } from './categories/tree/CategoryTreeCreate';
import { CategoryTreeIndex } from './categories/tree/CategoryTreeIndex';
import { CategoryTreeShow } from './categories/tree/CategoryTreeShow';
import { CategoryUploadIndex } from './categories/uploads/CategoryUploadIndex';
import { CategoryUploadCreate } from './categories/uploads/CategoryUploadCreate';
import { CategoryUploadShow } from './categories/uploads/CategoryUploadShow';
import { PricesheetIndex } from './pricesheets/PricesheetIndex';
import { PricesheetUploadIndex } from './pricesheets/uploads/PricesheetUploadIndex';
import { PricesheetUploadCreate } from './pricesheets/uploads/PricesheetUploadCreate';
import { PricesheetUploadShow } from './pricesheets/uploads/PricesheetUploadShow';
import { ProductIndex } from './products/ProductIndex';
import { ProductUploadCreate } from './products/uploads/ProductUploadCreate';
import { ProductUploadShow } from './products/uploads/ProductUploadShow';
import { ProductUploadIndex } from './products/uploads/ProductUploadIndex';
import { CollectionIndex } from './collections/CollectionIndex';
import { ManufacturerIndex } from './manufacturers/ManufacturerIndex';
import { ManufacturerEdit } from './manufacturers/ManufacturerEdit';
import { ExportIndex } from './products/exports/ExportIndex';
import { InventoryUploadCreate } from './products/InventoryUploadCreate';
import { ExportCreate } from './products/exports/Create';
import { ProductUtilities } from './products/Utilities';
import { CategoryUtilities } from './categories/Utilities';

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
