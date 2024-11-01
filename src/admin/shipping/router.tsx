import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../shared/Root';

import { ShippingPage } from './ShippingPage';
import { ErrorPage } from '../shared/ErrorPage';
import { ModeEdit } from './mode/ModeEdit';
import { GatewayEdit } from '../features/shipping/gateways/edit';
import { WarehouseEdit } from './warehouse/WarehouseEdit';
import { ParcelIndex } from './parcels/ParcelIndex';
import { ParcelEdit } from './parcels/ParcelEdit';

export const router = createHashRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />} errorElement={<ErrorPage />}>
			<Route index element={<ShippingPage />} />
			<Route path="mode" element={<ModeEdit />} />
			<Route path="parcels">
				<Route index element={<ParcelIndex />} />
				<Route path="create" element={<ParcelEdit />}></Route>
				<Route path=":id" element={<ParcelEdit />}></Route>
			</Route>
			<Route path="gateways" element={<GatewayEdit />} />
			<Route path="warehouse" element={<WarehouseEdit />} />
		</Route>
	)
);
