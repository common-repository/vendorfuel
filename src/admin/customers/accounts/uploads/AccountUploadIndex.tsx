import { CustomerService } from '../CustomerService';
import { Layout } from '../../../layout/Layout';
import { UploadIndex } from '../../../shared/UploadIndex';
import breadcrumbs from './breadcrumbs.json';

export const AccountUploadIndex = () => {
	const action = {
		label: 'Upload new',
		href: `?page=vf-customers#/accounts/uploads/create`,
	};

	return (
		<Layout
			heading="Account uploads"
			breadcrumbs={breadcrumbs}
			action={action}
		>
			<UploadIndex
				queryKey="account-upload-index"
				queryFn={CustomerService.indexBatches}
			/>
		</Layout>
	);
};
