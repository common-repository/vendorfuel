import { ManufacturerService } from '../../../features/catalog/manufacturers/manufacturer-service';
import { ResourceIndex } from '../../../shared/ResourceIndex';
import { Layout } from '../../../components/ui/layout/layout';
import { ManufacturerResource } from '../../../features/catalog/manufacturers/manufacturer-resource';
import { GridColDef, GridActionsColDef } from '@mui/x-data-grid';
import { ItemLink } from '../../../shared/ItemLink';
import { Button } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';

export const ManufacturerIndex = () => {
	const action = {
		label: 'Add New',
		href: `?page=vf-catalog#/manufacturers/create`,
	};

	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Manufacturers',
			to: `.`,
		},
	];

	const columns: (GridColDef | GridActionsColDef)[] = [
		{
			field: 'name',
			headerName: 'Name',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} />;
			},
		},
		{
			field: 'info',
			headerName: 'Description',
			flex: 2,
			renderCell: (params) => {
				return <ItemLink params={params} />;
			},
		},
		{
			field: 'website',
			headerName: 'Website',
			flex: 2,
			renderCell: (params) => {
				return params.value ? (
					<Button
						color="inherit"
						href={params.value}
						size="small"
						target="_blank"
						endIcon={<LaunchIcon />}
					>
						{params.value}
					</Button>
				) : null;
			},
		},
	];

	return (
		<Layout
			heading="Manufacturers"
			breadcrumbs={breadcrumbs}
			action={action}
		>
			<ResourceIndex
				columns={columns}
				queryFn={ManufacturerService.index}
				queryKey="manufacturer-index"
				resource={new ManufacturerResource()}
				searchable
				service={ManufacturerService}
			/>
		</Layout>
	);
};
