import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../shared/Root';

import { PurchasingPage } from './PurchasingPage';
import { ErrorPage } from '../shared/ErrorPage';
import { CostSheetUploadCreate } from './cost-sheets/uploads/CostsheetUploadCreate';
import { CostsheetUploadIndex } from './cost-sheets/uploads/CostsheetUploadIndex';
import { CostsheetUploadShow } from './cost-sheets/uploads/CostsheetUploadShow';
import { DocumentProfileIndex } from './document-profiles/DocumentProfilesIndex';
import { VendorIndex } from './vendors/VendorIndex';
import { VendorEdit } from './vendors/VendorEdit';

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
