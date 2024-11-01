import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { GroupService } from '../../../../features/customers/groups/group-service';
import { Layout } from '../../../../components/ui/layout/layout';
import { UploadShow } from '../../../../components/ui/upload-show';
import initialBreadcrumbs from '../../../../features/customers/groups/uploads/breadcrumbs.json';

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
