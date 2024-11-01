import {
	createHashRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';
import { Root } from '../../shared/Root';

import { ShippingPage } from '../../pages/shipping';
import { ErrorPage } from '../../pages/error';
import { ModeEdit } from '../../pages/shipping/mode';
import { GatewayEdit } from '../../pages/shipping/gateways';
import { WarehouseEdit } from '../../pages/shipping/warehouse';
import { ParcelIndex } from '../../pages/shipping/parcels';
import { ParcelEdit } from '../../pages/shipping/parcels/edit';

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
