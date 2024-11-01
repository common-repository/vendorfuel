import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../../shared/Root';

import { CustomersPage } from '../../pages/customers';
import { ErrorPage } from '../../pages/error';
import { AccountIndex } from '../../pages/customers/accounts';
import { AccountUploadCreate } from '../../pages/customers/accounts/uploads/create';
import { AccountUploadIndex } from '../../pages/customers/accounts/uploads';
import { AccountUploadShow } from '../../pages/customers/accounts/uploads/show';
import { GroupIndex } from '../../pages/customers/groups';
import { GroupUploadIndex } from '../../pages/customers/groups/uploads';
import { GroupUploadShow } from '../../pages/customers/groups/uploads/show';
import { GroupUploadCreate } from '../../pages/customers/groups/uploads/create';
import { RoleIndex } from '../../pages/customers/roles';

export const router = createHashRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />} errorElement={<ErrorPage />}>
			<Route index element={<CustomersPage />}></Route>
			<Route path="accounts">
				<Route index element={<AccountIndex />}></Route>
				<Route path="uploads">
					<Route index element={<AccountUploadIndex />}></Route>
					<Route
						path="create"
						element={<AccountUploadCreate />}
					></Route>
					<Route path=":id" element={<AccountUploadShow />}></Route>
				</Route>
			</Route>
			<Route path="groups">
				<Route index element={<GroupIndex />}></Route>
				<Route path="uploads">
					<Route index element={<GroupUploadIndex />}></Route>
					<Route
						path="create"
						element={<GroupUploadCreate />}
					></Route>
					<Route path=":id" element={<GroupUploadShow />}></Route>
				</Route>
			</Route>
			<Route path="roles" element={<RoleIndex />}></Route>
		</Route>
	)
);
