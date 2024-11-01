import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../shared/Root';

import { CustomersPage } from './CustomersPage';
import { ErrorPage } from '../shared/ErrorPage';
import { AccountIndex } from './accounts/AccountIndex';
import { AccountUploadCreate } from './accounts/uploads/AccountUploadCreate';
import { AccountUploadIndex } from './accounts/uploads/AccountUploadIndex';
import { AccountUploadShow } from './accounts/uploads/AccountUploadShow';
import { GroupIndex } from './groups/GroupIndex';
import { GroupUploadIndex } from './groups/uploads/GroupUploadIndex';
import { GroupUploadShow } from './groups/uploads/GroupUploadShow';
import { GroupUploadCreate } from './groups/uploads/GroupUploadCreate';
import { RoleIndex } from './roles/RoleIndex';

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
