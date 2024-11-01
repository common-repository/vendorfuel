import type { Params } from '../types';
import { ResourceIndex } from './ResourceIndex';
import { UploadResource } from './UploadResource';
import {
	GridColDef,
	GridActionsColDef,
	GridValueFormatterParams,
} from '@mui/x-data-grid';
import { dateValueFormatter } from './dateValueFormatter';
import { ItemLink } from './ItemLink';
import { renderStatus } from './renderStatus';

interface Props {
	queryKey: string;
	queryFn: (params: Params) => Promise<any>;
}

export const UploadIndex = (props: Props) => {
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
			resource={new UploadResource()}
		/>
	);
};
