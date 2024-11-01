import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { GroupService } from '../GroupService';
import { Layout } from '../../../layout/Layout';
import { UploadShow } from '../../../UploadShow';
import initialBreadcrumbs from './breadcrumbs.json';

export const GroupUploadShow = () => {
	const { id } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useState(initialBreadcrumbs);

	return (
		<Layout breadcrumbs={breadcrumbs} heading="Group upload">
			<UploadShow
				setBreadcrumbs={setBreadcrumbs}
				queryKey={`group-upload-${id}`}
				queryFn={GroupService.showBatch}
			/>
		</Layout>
	);
};
