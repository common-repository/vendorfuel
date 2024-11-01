import { Link } from '@mui/material';
import { CategoryService } from './CategoryService';
import { ResourceIndex } from '../../shared/ResourceIndex';
import { Layout } from '../../layout/Layout';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../shared/ItemLink';
import { renderProductImage } from '../../shared/renderProductImage';

export const CategoryIndex = () => {
	const action = {
		label: 'Add new',
		href: `?page=vendorfuel#!/catalog/categories/create`,
	};

	const breadcrumbs = [
		{
			label: 'Catalog',
			to: '/',
		},
		{
			label: 'Categories',
			to: `.`,
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
			label: 'Manage category trees',
			to: 'tree',
		},
		{
			label: 'Utilities',
			to: 'utilities',
		},
	];

	const pathToItem = '?page=vendorfuel#!/catalog/categories';

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'image',
			headerName: 'Image',
			renderCell: renderProductImage,
			valueGetter: (params) => params.row.img_url,
			sortable: false,
			width: 60,
		},
		{
			field: 'title',
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
		{
			field: 'parent_category',
			headerName: 'Parent category',
			valueGetter: (params) => params.row.parent_category?.title,
			renderCell: (params) => {
				return (
					<Link
						noWrap
						href={`${pathToItem}/${params.row.parent_category?.cat_id}`}
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
			heading="Categories"
			breadcrumbs={breadcrumbs}
			action={action}
			nav={nav}
		>
			<ResourceIndex
				columns={columns}
				queryFn={CategoryService.index}
				queryKey="category-index"
				idField="cat_id"
				pathToItem={pathToItem}
				getRowId={(row) => row.cat_id}
				searchable
				service={CategoryService}
			/>
		</Layout>
	);
};
