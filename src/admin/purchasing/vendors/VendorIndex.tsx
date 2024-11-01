import { VendorService } from './VendorService';
import { ResourceIndex } from '../../shared/ResourceIndex';
import { Layout } from '../../layout/Layout';
import { VendorResource } from './VendorResource';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../shared/ItemLink';

export const VendorIndex = () => {
	const action = {
		label: 'Add new',
		to: `create`,
	};

	const breadcrumbs = [
		{
			label: 'Purchasing',
			to: `/`,
		},
		{
			label: 'Vendors',
			to: `.`,
		},
	];

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'name',
			headerName: 'Name',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} />;
			},
		},
	];

	return (
		<Layout heading="Vendors" breadcrumbs={breadcrumbs} action={action}>
			<ResourceIndex
				columns={columns}
				queryFn={VendorService.index}
				queryKey="vendor-index"
				resource={new VendorResource()}
				searchable
				service={VendorService}
			/>
		</Layout>
	);
};
