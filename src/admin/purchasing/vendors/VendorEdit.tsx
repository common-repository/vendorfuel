import { useParams } from 'react-router-dom';
import { Vendor } from './Vendor';
import { VendorService } from './VendorService';
import { Layout } from '../../layout/Layout';
import { ResourceEdit } from '../../shared/ResourceEdit';

export const VendorEdit = () => {
	const { id } = useParams();
	const breadcrumbs = [
		{
			label: 'Purchasing',
			to: `/purchasing`,
		},
		{
			label: 'Vendors',
			to: `..`,
		},
		{
			label: `${id ? 'Edit' : 'Add'} vendor ${id ? id : ''}`,
			href: `?page=vf-purchasing#/vendors/${id ? id : 'create'}`,
		},
	];

	return (
		<Layout
			heading={`${id ? 'Edit' : 'Add'} vendor`}
			breadcrumbs={breadcrumbs}
		>
			<ResourceEdit model={Vendor} service={VendorService} />
		</Layout>
	);
};
