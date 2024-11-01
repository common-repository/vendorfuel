import { PricesheetService } from '../../../features/catalog/pricesheets/pricesheet-service';
import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../components/ui/layout/layout';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../../shared/ItemLink';

export const PricesheetIndex = () => {
	const action = {
		label: 'Add New',
		href: `?page=vendorfuel#!/catalog/pricesheets/create`,
	};

	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Price sheets',
			to: `.`,
		},
	];

	const nav = [
		{
			label: 'Upload',
			to: 'uploads/create',
		},
		{
			label: 'Manage uploads',
			to: 'uploads',
		},
	];

	const pathToItem = '?page=vendorfuel#!/catalog/pricesheets';

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'sheet',
			headerName: 'Name',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} path={pathToItem} />;
			},
		},
	];

	return (
		<Layout
			heading="Price sheets"
			breadcrumbs={breadcrumbs}
			action={action}
			nav={nav}
		>
			<ResourceIndex
				columns={columns}
				queryFn={PricesheetService.index}
				queryKey="pricesheet-index"
				idField="price_sheet_id"
				getRowId={(row) => row.price_sheet_id}
				pathToItem={pathToItem}
				service={PricesheetService}
			/>
		</Layout>
	);
};
