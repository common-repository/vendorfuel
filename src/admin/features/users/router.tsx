import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../../shared/Root';
import { ErrorPage } from '../../pages/error';
import { UserIndex } from '../../pages/users';

export const router = createHashRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />} errorElement={<ErrorPage />}>
			<Route index element={<UserIndex />}></Route>
		</Route>
	)
);
