import { useParams } from 'react-router-dom';
import { Vendor } from '../../../features/purchasing/vendors/vendor';
import { VendorService } from '../../../features/purchasing/vendors/vendor-service';
import { Layout } from '../../../components/ui/layout/layout';
import { ResourceEdit } from '../../../shared/ResourceEdit';

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
