import { UserService } from './UserService';
import { ResourceIndex } from '../shared/ResourceIndex';
import { Layout } from '../layout/Layout';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../shared/ItemLink';

export const UserIndex = () => {
	const action = {
		label: 'Add new',
		href: `?page=vendorfuel#!/admin/create`,
	};

	const pathToItem = '?page=vendorfuel#!/admin';

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
	];

	return (
		<Layout heading="Admin users" action={action}>
			<ResourceIndex
				columns={columns}
				pathToItem={pathToItem}
				queryFn={UserService.index}
				queryKey="user-index"
				searchable
				service={UserService}
			/>
		</Layout>
	);
};
