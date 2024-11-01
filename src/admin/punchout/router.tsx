import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../shared/Root';
import { PunchoutPage } from './PunchoutPage';
import { ErrorPage } from '../shared/ErrorPage';
import { SupplierIndex } from './suppliers/Index';
import { SupplierEdit } from './suppliers/Edit';

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
