import { CustomerService } from '../../../../features/customers/customer-service';
import { Layout } from '../../../../components/ui/layout/layout';
import { UploadIndex } from '../../../../shared/UploadIndex';
import breadcrumbs from '../../../../features/customers/accounts/uploads/breadcrumbs.json';

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
