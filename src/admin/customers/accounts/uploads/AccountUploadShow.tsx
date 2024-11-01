import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { CustomerService } from '../CustomerService';
import { Layout } from '../../../layout/Layout';
import { UploadShow } from '../../../UploadShow';
import initialBreadcrumbs from './breadcrumbs.json';

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
