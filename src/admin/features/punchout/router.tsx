import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../../shared/Root';
import { PunchoutPage } from '../../pages/punchout';
import { ErrorPage } from '../../pages/error';
import { SupplierIndex } from '../../pages/punchout/suppliers';
import { SupplierEdit } from '../../pages/punchout/suppliers/edit';

export const router = createHashRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />} errorElement={<ErrorPage />}>
			<Route index element={<PunchoutPage />}></Route>
			<Route path="suppliers">
				<Route index element={<SupplierIndex />}></Route>
				<Route path="create" element={<SupplierEdit />}></Route>
				<Route path=":id" element={<SupplierEdit />}></Route>
			</Route>
		</Route>
	)
);
