import { DocumentProfileService } from '../../../features/purchasing/document-profiles/document-profile-service';
import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../components/ui/layout/layout';
import { DocumentProfileResource } from '../../../features/purchasing/document-profiles/document-profile-resource';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../../shared/ItemLink';

export const DocumentProfileIndex = () => {
	const rootURL = `${location.origin}${location.pathname}`;

	const action = {
		label: 'Add New',
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
