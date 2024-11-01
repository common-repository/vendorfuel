import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../layout/Layout';
import {
	GridColDef,
	GridActionsColDef,
	GridValueFormatterParams,
} from '@mui/x-data-grid';
import { dateValueFormatter } from '../../../shared/dateValueFormatter';
import { ProductExportService } from '../../../products/ProductExportService';

export const ExportIndex = () => {
	const action = {
		label: 'Export products',
		to: 'create',
	};

	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Products',
			to: `..`,
		},
		{
			label: 'Exports',
			to: `.`,
		},
	];

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'filename',
			headerName: 'Filename',
			valueFormatter: (params: GridValueFormatterParams) =>
				params.value || '(Untitled)',
			sortable: false,
			flex: 1,
		},
		{
			field: 'created_at',
			headerName: 'Created',
			valueFormatter: dateValueFormatter,
			sortable: false,
			flex: 1,
		},
		{
			field: 'updated_at',
			headerName: 'Updated',
			valueFormatter: dateValueFormatter,
			sortable: false,
			flex: 1,
		},
		{
			field: 'started_at',
			headerName: 'Started',
			valueFormatter: dateValueFormatter,
			sortable: false,
			flex: 1,
		},
		{
			field: 'finished_at',
			headerName: 'Finished',
			valueFormatter: dateValueFormatter,
			sortable: false,
			flex: 1,
		},
	];

	return (
		<Layout heading="Exports" breadcrumbs={breadcrumbs} action={action}>
			<ResourceIndex
				canDownload
				canEdit={false}
				canView={false}
				columns={columns}
				queryFn={ProductExportService.index}
				queryKey="product-export-index"
				service={ProductExportService}
			/>
		</Layout>
	);
};
