import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../components/ui/layout/layout';
import {
	GridColDef,
	GridActionsColDef,
	GridValueFormatterParams,
} from '@mui/x-data-grid';
import { ItemLink } from '../../../shared/ItemLink';
import { ParcelService } from '../../../features/shipping/parcels/parcel-service';

export const ParcelIndex = () => {
	const action = { label: 'Add New', to: './create' };
	const parent = { label: 'Shipping', to: '..' };

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'title',
			headerName: 'Name',
			valueFormatter: (params: GridValueFormatterParams) =>
				params.value || '(Untitled)',
			sortable: false,
			renderCell: (params) => {
				return <ItemLink params={params} />;
			},
			flex: 2,
		},
		{
			field: 'length',
			headerName: 'Length',
			flex: 1,
		},
		{
			field: 'width',
			headerName: 'Width',
			flex: 1,
		},
		{
			field: 'height',
			headerName: 'Height',
			flex: 1,
		},
		{
			field: 'distance_unit',
			headerName: 'Distance unit',
			flex: 1,
		},
	];

	return (
		<Layout heading="Parcels" action={action} parent={parent}>
			<ResourceIndex
				columns={columns}
				queryFn={ParcelService.index}
				queryKey="parcel-index"
				service={ParcelService}
			/>
		</Layout>
	);
};
