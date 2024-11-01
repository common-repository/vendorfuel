import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../components/ui/layout/layout';
import { ReportDownloadService } from '../../../features/reports/report-download-service';
import { dateValueFormatter } from '../../../shared/dateValueFormatter';
import {
	GridColDef,
	GridActionsColDef,
	GridValueFormatterParams,
} from '@mui/x-data-grid';

export const ReportDownloadIndex = () => {
	const breadcrumbs = [
		{
			label: 'Reports',
			href: `?page=vendorfuel#!/reports`,
		},
		{
			label: 'Downloadable reports',
			href: `?page=vf-admin#/reports/downloads`,
		},
	];

	const nav = [
		{
			label: 'Edit reports',
			href: `?page=vendorfuel#!/reports`,
		},
		{
			label: 'Schedule reports',
			href: `?page=vf-admin#/reports/schedule`,
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
			field: 'processed_on',
			headerName: 'Processed',
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
		<Layout
			heading="Downloadable reports"
			breadcrumbs={breadcrumbs}
			nav={nav}
		>
			<ResourceIndex
				canDownload
				canEdit={false}
				canView={false}
				columns={columns}
				queryFn={ReportDownloadService.index}
				queryKey="report-download-index"
				service={ReportDownloadService}
			/>
		</Layout>
	);
};
