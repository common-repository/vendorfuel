import { GroupService } from './GroupService';
import { ResourceIndex } from '../../shared/ResourceIndex';
import { Layout } from '../../layout/Layout';
import { GroupResource } from './GroupResource';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../shared/ItemLink';

export const GroupIndex = () => {
	const action = {
		label: 'Add new',
		href: `?page=vendorfuel#!/customers/groups/create`,
	};

	const breadcrumbs = [
		{
			label: 'Customers',
			href: `/`,
		},
		{
			label: 'Groups',
			href: `/groups`,
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

	const pathToItem = '?page=vendorfuel#!/customers/groups';

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'name',
			headerName: 'Name',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} path={pathToItem} />;
			},
		},
	];

	return (
		<Layout
			heading="Groups"
			breadcrumbs={breadcrumbs}
			action={action}
			nav={nav}
		>
			<ResourceIndex
				columns={columns}
				idField="group_id"
				pathToItem={pathToItem}
				queryFn={GroupService.index}
				queryKey="group-index"
				getRowId={(row) => row.group_id}
				searchable
				service={GroupService}
			/>
		</Layout>
	);
};
