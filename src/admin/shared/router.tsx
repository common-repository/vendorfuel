import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from './Root';

import { DashboardPage } from '../dashboard/DashboardPage';
import { ErrorPage } from './ErrorPage';
import { ReportDownloadIndex } from '../reports/downloads/ReportDownloadIndex';
import { ReportIndex } from '../reports/ReportIndex';
import { ReportEdit } from '../reports/ReportEdit';
import { ClearSale } from '../settings/ClearSale';

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
