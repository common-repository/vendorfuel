import { DocumentProfileService } from './DocumentProfileService';
import { ResourceIndex } from '../../shared/ResourceIndex';
import { Layout } from '../../layout/Layout';
import { DocumentProfileResource } from './DocumentProfileResource';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../shared/ItemLink';

export const DocumentProfileIndex = () => {
	const rootURL = `${location.origin}${location.pathname}`;

	const action = {
		label: 'Add new',
		href: `?page=vendorfuel#!/purchasing/document-profiles/create`,
	};

	const breadcrumbs = [
		{
			label: 'Purchasing',
			to: `..`,
		},
		{
			label: 'Document profiles',
			to: `.`,
		},
	];

	const pathToItem = '?page=vendorfuel#!/purchasing/document-profiles';

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
			heading="Document profiles"
			breadcrumbs={breadcrumbs}
			action={action}
		>
			<ResourceIndex
				columns={columns}
				pathToItem={pathToItem}
				queryFn={DocumentProfileService.index}
				queryKey="document-profile-index"
				resource={new DocumentProfileResource()}
				searchable
				service={DocumentProfileService}
			/>
		</Layout>
	);
};
