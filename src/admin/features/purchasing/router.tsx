import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../../shared/Root';

import { PurchasingPage } from '../../pages/purchasing';
import { ErrorPage } from '../../pages/error';
import { CostSheetUploadCreate } from '../../pages/purchasing/cost-sheets/uploads/create';
import { CostsheetUploadIndex } from '../../pages/purchasing/cost-sheets/uploads';
import { CostsheetUploadShow } from '../../pages/purchasing/cost-sheets/uploads/show';
import { DocumentProfileIndex } from '../../pages/purchasing/document-profiles';
import { VendorIndex } from '../../pages/purchasing/vendors';
import { VendorEdit } from '../../pages/purchasing/vendors/edit';

export const router = createHashRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />} errorElement={<ErrorPage />}>
			<Route index element={<PurchasingPage />}></Route>
			<Route path="cost-sheets">
				<Route path="uploads">
					<Route index element={<CostsheetUploadIndex />}></Route>
					<Route
						path="create"
						element={<CostSheetUploadCreate />}
					></Route>
					<Route path=":id" element={<CostsheetUploadShow />}></Route>
				</Route>
			</Route>
			<Route
				path="document-profiles"
				element={<DocumentProfileIndex />}
			></Route>
			<Route path="vendors">
				<Route index element={<VendorIndex />}></Route>
				<Route path="create" element={<VendorEdit />}></Route>
				<Route path=":id" element={<VendorEdit />}></Route>
			</Route>
		</Route>
	)
);
