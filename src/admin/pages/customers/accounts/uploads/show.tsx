import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { CustomerService } from '../../../../features/customers/customer-service';
import { Layout } from '../../../../components/ui/layout/layout';
import { UploadShow } from '../../../../components/ui/upload-show';
import initialBreadcrumbs from '../../../../features/customers/accounts/uploads/breadcrumbs.json';

export const AccountUploadShow = () => {
	const { id } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useState(initialBreadcrumbs);

	return (
		<Layout breadcrumbs={breadcrumbs} heading="Account upload">
			<UploadShow
				setBreadcrumbs={setBreadcrumbs}
				queryKey={`account-upload-${id}`}
				queryFn={CustomerService.showBatch}
			/>
		</Layout>
	);
};
