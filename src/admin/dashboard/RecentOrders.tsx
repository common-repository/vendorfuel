import { useQuery } from '@tanstack/react-query';
import { OrderService } from '../orders/OrderService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Chip, Link, Paper, TableContainer, Typography } from '@mui/material';

type Color =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'error'
	| 'info'
	| 'success'
	| 'warning';

const columns: GridColDef[] = [
	{
		field: 'order_id',
		headerName: 'ID',
		renderCell: (params) => {
			return (
				<Link
					href={`?page=vendorfuel#!/orders/${params.value}`}
					sx={{ textDecoration: 'none' }}
				>
					{params.value}
				</Link>
			);
		},
	},
	{
		field: 'customer',
		flex: 2,
		headerName: 'Customer',
		renderCell: (params) => {
			return (
				<>
					{params.value.guest ? (
						<>{params.value.name}</>
					) : (
						<Link
							href={`?page=vendorfuel#!/customers/accounts/${params.value.id}`}
							sx={{ textDecoration: 'none' }}
						>
							{params.value.name}
						</Link>
					)}
				</>
			);
		},
	},
	{
		field: 'order_date',
		flex: 1,
		headerName: 'Date',
		type: 'dateTime',
		valueGetter: (params) => new Date(params.value),
	},
	{
		field: 'status',
		flex: 1,
		headerName: 'Status',
		renderCell: (params) => {
			return (
				<Chip
					color={statusColor(params.value)}
					label={params.value}
					sx={{ textTransform: 'capitalize' }}
				/>
			);
		},
	},
	{
		field: 'total_amt',
		flex: 1,
		headerName: 'Total',
		type: 'number',
		valueGetter: (params) =>
			new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(params.value),
	},
];

function statusColor(value: string): Color {
	switch (value) {
		case 'completed':
			return 'success';
		case 'cancelled':
			return 'error';
		default:
			return 'default';
	}
}

export const RecentOrders = () => {
	const params = {
		direction: 'desc',
		orderBy: 'order_id',
		perPage: 10,
	};

	const statusToContext = (status: string): string => {
		switch (status) {
			case 'created':
			case 'pending-approval':
				return 'warning';
			case 'completed':
				return 'success';
			case 'cancelled':
				return 'danger';
			default:
				return 'light';
		}
	};

	const { data: orders, isLoading } = useQuery({
		queryKey: ['orders'],
		queryFn: () => OrderService.index(params),
	});

	return (
		<>
			{orders ? (
				<>
					<Typography variant="subtitle1" gutterBottom>
						Recent orders
					</Typography>
					<TableContainer component={Paper} sx={{ mb: 3 }}>
						<DataGrid
							autoHeight
							columns={columns}
							disableColumnSelector
							getRowId={(row) => row.order_id}
							hideFooter
							loading={isLoading}
							rows={orders}
						/>
					</TableContainer>
				</>
			) : null}
		</>
	);
};
