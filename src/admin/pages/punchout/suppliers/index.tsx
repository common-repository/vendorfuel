import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../components/ui/layout/layout';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../../shared/ItemLink';
import { renderProductImage } from '../../../shared/renderProductImage';
import { SupplierService } from '../../../features/punchout/suppliers/supplier-service';

export const SupplierIndex = () => {
	const action = { label: 'Add New', to: 'create' };

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'logo',
			headerName: 'Logo',
			renderCell: renderProductImage,
			valueGetter: (params) => params.row.logo,
			sortable: false,
			width: 60,
		},
		{
			field: 'name',
			headerName: 'Name',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} />;
			},
		},
		{
			field: 'domain_type',
			headerName: 'Domain type',
			flex: 1,
		},
		{
			field: 'update_endpoints_daily',
			headerName: 'Update endpoints daily',
			flex: 1,
			type: 'boolean',
		},
		{
			field: 'prefix',
			headerName: 'Prefix',
			flex: 1,
		},
	];
	const parent = { label: 'Punchout', to: '..' };

	return (
		<Layout action={action} heading="Suppliers" parent={parent}>
			<ResourceIndex
				columns={columns}
				queryFn={SupplierService.index}
				queryKey="category-index"
				searchable
				service={SupplierService}
			/>
		</Layout>
	);
};
