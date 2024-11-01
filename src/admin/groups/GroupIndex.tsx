import React from 'react';
import { GroupService } from '../../../app/services/GroupService';
import { ResourceIndex } from '../../../resources/js/Shared/ResourceIndex';
import { Layout } from '../layout/Layout';
import { GroupResource } from '../../../app/resources/GroupResource';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../../resources/js/Shared/renderers/ItemLink';

export const GroupIndex = () => {
	const action = {
		label: 'Add new',
		href: `?page=vendorfuel#!/customers/groups/create`,
	};

	const breadcrumbs = [
		{
			label: 'Customers',
			href: `?page=vf-admin#/customers`,
		},
		{
			label: 'Groups',
			href: `?page=vf-admin#/customers/groups`,
		},
	];

	const nav = [
		{
			label: 'Upload',
			href: '?page=vf-admin#/customers/groups/uploads/create',
		},
		{
			label: 'Manage uploads',
			href: '?page=vf-admin#/customers/groups/uploads',
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
