import { CustomerService } from './CustomerService';
import { ResourceIndex } from '../../shared/ResourceIndex';
import { Layout } from '../../layout/Layout';
import { AccountResource } from './AccountResource';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../shared/ItemLink';
import { renderStatus } from '../../shared/renderStatus';
import { Link } from '@mui/material';

export const AccountIndex = () => {
	const action = {
		label: 'Add new',
		href: `?page=vendorfuel#!/customers/accounts/create`,
	};

	const breadcrumbs = [
		{
			label: 'Customers',
			to: `/`,
		},
		{
			label: 'Accounts',
			to: `/accounts`,
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
		{
			label: 'Settings',
			href: '?page=vendorfuel#!customers/accounts/settings',
		},
	];

	const searchByOptions = [
		{ value: 'ID', key: 'id' },
		{ value: 'Name', key: 'name' },
		{ value: 'Email', key: 'email' },
	];

	const pathToItem = '?page=vendorfuel#!/customers/accounts';

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'name',
			headerName: 'Name',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} path={pathToItem} />;
			},
		},
		{
			field: 'email',
			headerName: 'Email',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} path={pathToItem} />;
			},
		},
		{
			field: 'status',
			headerName: 'Status',
			renderCell: renderStatus,
		},
		{
			field: 'group',
			headerName: 'Group',
			valueGetter: (params) => params.row.group?.name,
			renderCell: (params) => {
				return (
					<Link
						noWrap
						href={`?page=vendorfuel#!/customers/groups/${params.row.group?.group_id}`}
						sx={{ textDecoration: 'none' }}
					>
						{params.value}
					</Link>
				);
			},
			sortable: false,
			flex: 1,
		},
	];

	return (
		<Layout
			heading="Accounts"
			breadcrumbs={breadcrumbs}
			action={action}
			nav={nav}
		>
			<ResourceIndex
				columns={columns}
				pathToItem={pathToItem}
				queryFn={CustomerService.index}
				queryKey="account-index"
				resource={new AccountResource()}
				searchable
				searchByOptions={searchByOptions}
				service={CustomerService}
			/>
		</Layout>
	);
};
