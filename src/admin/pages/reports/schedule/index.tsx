import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../components/ui/layout/layout';
import { ReportService } from '../../../features/reports/report-service';
import { ReportResource } from '../../../features/reports/report-resource';
import {
	GridColDef,
	GridActionsColDef,
	GridValueFormatterParams,
} from '@mui/x-data-grid';
import { dateValueFormatter } from '../../../shared/dateValueFormatter';
import { renderStatus } from '../../../shared/renderStatus';
import { ItemLink } from '../../../shared/ItemLink';

export const ReportIndex = () => {
	const breadcrumbs = [
		{
			label: 'Reports',
			href: `?page=vendorfuel#!/reports`,
		},
		{
			label: 'Schedule reports',
			href: `?page=vf-admin#/reports/schedule`,
		},
	];

	const nav = [
		{
			label: 'Edit reports',
			href: `?page=vendorfuel#!/reports`,
		},
		{
			label: 'Downloadable reports',
			href: `?page=vf-admin#/reports/downloads`,
		},
	];

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'name',
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
			field: 'frequency',
			headerName: 'Frequency',
			renderCell: renderStatus,
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
	];

	return (
		<Layout heading="Schedule reports" breadcrumbs={breadcrumbs} nav={nav}>
			<ResourceIndex
				columns={columns}
				queryFn={ReportService.index}
				queryKey="report-index"
				resource={new ReportResource()}
				service={ReportService}
			/>
		</Layout>
	);
};
