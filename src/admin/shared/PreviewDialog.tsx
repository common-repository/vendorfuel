import { useEffect, useState } from '@wordpress/element';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import {
	DataGrid,
	GridColDef,
	GridValueFormatterParams,
} from '@mui/x-data-grid';
import { keyNames } from './keyNames';

interface Item {
	name?: string;
	filename?: string;
	title?: string;
	sheet?: string;
	description?: string;
}

export const PreviewDialog = (props) => {
	const PAGE_SIZE = 10;
	const { params: itemParams, open, setOpen } = props;
	const [item, setItem] = useState<Item>();
	const [rows, setRows] = useState([]);

	const columns: GridColDef[] = [
		{
			field: 'key',
			headerName: 'Key',
			flex: 1,
			valueFormatter: (params: GridValueFormatterParams<string>) => {
				return (
					keyNames[params.value] ||
					params.value.charAt(0).toUpperCase() +
						params.value
							.slice(1)
							.replace(/_/g, ' ')
							.replace(/id/g, 'ID')
				);
			},
			hideable: false,
		},
		{
			field: 'value',
			headerName: 'Value',
			flex: 3,
			hideable: false,
			valueFormatter: (params: GridValueFormatterParams) => {
				if (
					params.value &&
					[
						'created_at',
						'finished_at',
						'last_login',
						'last_login_at',
						'last_update',
						'processed_on',
						'downloaded_on',
						'started_at',
						'updated_at',
						'uploaded_at',
					].includes(params.id)
				) {
					return new Date(params.value).toLocaleString();
				} else if (
					[
						'ignore_inventory',
						'group_registration_available',
						'rebate',
						'receive_quotes',
						'truck_only',
					].includes(params.id)
				) {
					return new Boolean(params.value);
				} else if (
					params.value === null ||
					params.value === '' ||
					(params.value instanceof Array && !params.value.length)
				) {
					return `—`;
				} else if (typeof params.value === 'object') {
					return `${JSON.stringify(params.value)}`;
				}
				return params.value;
			},
		},
	];

	const handleClose = () => {
		setOpen(false);
	};

	const itemName = () => {
		if (item) {
			return (
				item.name ||
				item.filename ||
				item.title ||
				item.sheet ||
				item.description ||
				'(Untitled)'
			);
		}
	};

	useEffect(() => {
		if (itemParams?.row) {
			setItem(itemParams.row);
			setRows(
				Object.entries(itemParams.row).map((row) => {
					return { key: row[0], value: row[1] };
				})
			);
		}
	}, [itemParams]);

	return (
		<>
			{item && (
				<Dialog
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					fullWidth
					maxWidth="md"
					onClose={handleClose}
					open={open}
				>
					<DialogTitle id="alert-dialog-title" noWrap>
						Previewing <em>{itemName()}</em>
					</DialogTitle>
					<DialogContent>
						<DataGrid
							autoHeight
							columns={columns}
							density="compact"
							disableColumnSelector
							disableSelectionOnClick
							hideFooter={rows.length <= PAGE_SIZE}
							getRowId={(row) => row.key}
							pageSize={PAGE_SIZE}
							rows={rows}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Close</Button>
					</DialogActions>
				</Dialog>
			)}
		</>
	);
};
