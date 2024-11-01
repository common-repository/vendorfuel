import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../../shared/Root';

import { DashboardPage } from '../../pages/dashboard';
import { ErrorPage } from '../../pages/error';
import { ReportDownloadIndex } from '../../pages/reports/downloads';
import { ReportIndex } from '../../pages/reports/schedule';
import { ReportEdit } from '../../pages/reports/schedule/edit';
import { ClearSale } from '../../pages/settings/clearsale';

export const router = createHashRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />} errorElement={<ErrorPage />}>
			<Route index element={<DashboardPage />}></Route>
			<Route path="reports">
				<Route path="schedule">
					<Route index element={<ReportIndex />}></Route>
					<Route path=":id" element={<ReportEdit />}></Route>
				</Route>
				<Route
					path="downloads"
					element={<ReportDownloadIndex />}
				></Route>
			</Route>
			<Route path="settings">
				<Route path="clearsale" element={<ClearSale />}></Route>
			</Route>
		</Route>
	)
);
