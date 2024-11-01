import { CollectionService } from './CollectionService';
import { ResourceIndex } from '../../shared/ResourceIndex';
import { Layout } from '../../layout/Layout';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../shared/ItemLink';
import { renderProductImage } from '../../shared/renderProductImage';

export const CollectionIndex = () => {
	const action = {
		label: 'Add new',
		href: `?page=vendorfuel#!/catalog/collections/create`,
	};

	const parent = {
		label: 'Catalog',
		to: '/',
	};

	const pathToItem = '?page=vendorfuel#!/catalog/collections';

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'img_url',
			headerName: 'Image',
			renderCell: renderProductImage,
			sortable: false,
			width: 60,
		},
		{
			field: 'name',
			headerName: 'Name',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} path={pathToItem} />;
			},
		},
		{
			field: 'description',
			headerName: 'Description',
			flex: 2,
		},
	];

	return (
		<Layout heading="Collections" parent={parent} action={action}>
			<ResourceIndex
				columns={columns}
				pathToItem="?page=vendorfuel#!/catalog/collections"
				queryFn={CollectionService.index}
				queryKey="collection-index"
				searchable
				service={CollectionService}
			/>
		</Layout>
	);
};
