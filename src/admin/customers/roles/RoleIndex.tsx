import { RoleService } from './RoleService';
import { ResourceIndex } from '../../shared/ResourceIndex';
import { Layout } from '../../layout/Layout';
import { RoleResource } from './RoleResource';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../shared/ItemLink';

export const RoleIndex = () => {
	const action = {
		label: 'Add new',
		href: `?page=vendorfuel#!/customers/roles/create`,
	};

	const breadcrumbs = [
		{
			label: 'Customers',
			href: `?page=vf-customers`,
		},
		{
			label: 'Roles',
			href: `?page=vf-customers#/roles`,
		},
	];

	const pathToItem = '?page=vendorfuel#!/customers/roles';

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
		<Layout heading="Roles" breadcrumbs={breadcrumbs} action={action}>
			<ResourceIndex
				columns={columns}
				pathToItem={pathToItem}
				queryFn={RoleService.index}
				queryKey="role-index"
				resource={new RoleResource()}
				searchable
				service={RoleService}
			/>
		</Layout>
	);
};
