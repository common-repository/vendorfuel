import { Link } from '@mui/material';
import {
	GridColDef,
	GridActionsColDef,
	GridValueFormatterParams,
} from '@mui/x-data-grid';
import { PricesheetService } from '../PricesheetService';
import { Layout } from '../../../layout/Layout';
import type { Params } from '../../../types';
import { ResourceIndex } from '../../../shared/ResourceIndex';
import { dateValueFormatter } from '../../../shared/dateValueFormatter';
import { ItemLink } from '../../../shared/ItemLink';
import { renderStatus } from '../../../shared/renderStatus';

interface Props {
	queryKey: string;
	queryFn: (params: Params) => Promise<any>;
}

export const PricesheetUploadIndex = () => {
	const action = {
		label: 'Upload new',
		href: `?page=vf-catalog#/pricesheets/uploads/create`,
	};

	const breadcrumbs = [
		{
			label: 'Catalog',
			href: `?page=vf-catalog`,
		},
		{
			label: 'Price sheets',
			href: `?page=vf-catalog#/pricesheets`,
		},
		{
			label: 'Price sheet uploads',
			href: `?page=vf-catalog#/pricesheets/uploads`,
		},
	];

	return (
		<Layout
			heading="Price sheet uploads"
			breadcrumbs={breadcrumbs}
			action={action}
		>
			<UploadIndex
				queryKey="pricesheet-upload-index"
				queryFn={PricesheetService.indexBatches}
			/>
		</Layout>
	);
};

const UploadIndex = (props: Props) => {
	const { queryFn, queryKey } = props;

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'filename',
			headerName: 'Filename',
			valueFormatter: (params: GridValueFormatterParams) =>
				params.value || '(Untitled)',
			renderCell: (params) => {
				return <ItemLink params={params} />;
			},
			sortable: false,
			flex: 2,
		},
		{
			field: 'price_sheet_id',
			headerName: 'Price sheet ID',
			flex: 1,
			renderCell: (params) => {
				return (
					<Link
						href={`?page=vendorfuel#!/catalog/pricesheets/${params.value}`}
						sx={{ textDecoration: 'none' }}
					>
						{params.value}
					</Link>
				);
			},
		},
		{
			field: 'status',
			headerName: 'Status',
			renderCell: renderStatus,
			flex: 1,
		},
		{
			field: 'uploaded_at',
			headerName: 'Uploaded',
			valueFormatter: dateValueFormatter,
			flex: 1,
		},
		{
			field: 'started_at',
			headerName: 'Started',
			valueFormatter: dateValueFormatter,
			flex: 1,
		},
		{
			field: 'finished_at',
			headerName: 'Finished',
			valueFormatter: dateValueFormatter,
			flex: 1,
		},
	];

	return (
		<ResourceIndex
			canEdit={false}
			canDelete={false}
			columns={columns}
			queryFn={queryFn}
			queryKey={queryKey}
		/>
	);
};
