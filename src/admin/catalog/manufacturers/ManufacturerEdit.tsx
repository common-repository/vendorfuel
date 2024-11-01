import { useParams } from 'react-router-dom';
import { Manufacturer } from './Manufacturer';
import { ManufacturerService } from './ManufacturerService';
import { Layout } from '../../layout/Layout';
import { ResourceEdit } from '../../shared/ResourceEdit';

export const ManufacturerEdit = () => {
	const { id } = useParams();
	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Manufacturers',
			to: `..`,
		},
		{
			label: `${id ? 'Edit' : 'Add'} manufacturer ${id ? id : ''}`,
			href: `?page=vf-catalog#/manufacturers/${id ? id : 'create'}`,
		},
	];

	return (
		<Layout
			heading={`${id ? 'Edit' : 'Add'} manufacturer`}
			breadcrumbs={breadcrumbs}
		>
			<ResourceEdit model={Manufacturer} service={ManufacturerService} />
		</Layout>
	);
};
