import {
	GridActionsCellItem,
	GridColDef,
	GridRowParams,
	GridActionsColDef,
} from '@mui/x-data-grid';
import { ProductService } from '../../../features/catalog/products/product-service';
import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../components/ui/layout/layout';
import { renderCategoryLink } from '../../../shared/renderCategoryLink';
import { renderProductImage } from '../../../shared/renderProductImage';
import { renderStatus } from '../../../shared/renderStatus';
import { ItemLink } from '../../../shared/ItemLink';

export const ProductIndex = () => {
	const action = {
		label: 'Add New',
		href: `?page=vendorfuel#!/catalog/products/create`,
	};

	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Products',
			to: `.`,
		},
	];

	const pathToItem = '?page=vendorfuel#!/catalog/products';

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'image',
			headerName: 'Image',
			renderCell: renderProductImage,
			valueGetter: (params) => params.row.image?.thumb_url,
			sortable: false,
			width: 60,
		},
		{
			field: 'description',
			headerName: 'Name',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} path={pathToItem} />;
			},
		},
		{
			field: 'sku',
			headerName: 'SKU',
			flex: 1,
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
			field: 'category',
			headerName: 'Category',
			renderCell: renderCategoryLink,
			sortable: false,
			flex: 1,
		},
		{
			field: 'qty',
			type: 'number',
			headerName: 'Quantity',
		},
	];

	const nav = [
		{
			label: 'Inventory',
			to: 'inventory',
		},
		{
			label: 'Imports',
			to: 'uploads',
		},
		{
			label: 'Exports',
			to: 'exports',
		},
		{
			label: 'Reviews',
			href: '?page=vendorfuel#!/catalog/products/reviews',
		},
		{
			label: 'Utilities',
			to: 'utilities',
		},
	];

	const searchByOptions = [
		{ value: 'ID', key: 'product_id' },
		{ value: 'Name', key: 'description' },
		{ value: 'SKU', key: 'sku' },
	];

	return (
		<Layout
			heading="Products"
			breadcrumbs={breadcrumbs}
			action={action}
			nav={nav}
		>
			<ResourceIndex
				columns={columns}
				queryFn={ProductService.index}
				queryKey="product-index"
				idField="product_id"
				pathToItem={pathToItem}
				getRowId={(row) => row.product_id}
				searchByOptions={searchByOptions}
				service={ProductService}
			/>
		</Layout>
	);
};
