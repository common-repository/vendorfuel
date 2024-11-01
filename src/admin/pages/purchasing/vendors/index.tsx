import { VendorService } from '../../../features/purchasing/vendors/vendor-service';
import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../components/ui/layout/layout';
import { VendorResource } from '../../../features/purchasing/vendors/vendor-resource';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../../shared/ItemLink';

export const VendorIndex = () => {
	const action = {
		label: 'Add New',
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
