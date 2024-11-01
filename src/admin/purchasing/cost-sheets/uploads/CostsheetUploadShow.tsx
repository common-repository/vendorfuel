import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { CostsheetService } from '../CostsheetService';
import { Layout } from '../../../layout/Layout';
import { UploadShow } from '../../../UploadShow';
import initialBreadcrumbs from './breadcrumbs.json';

export const CostsheetUploadShow = () => {
	const { id } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useState(initialBreadcrumbs);

	return (
		<Layout breadcrumbs={breadcrumbs} heading="Cost sheet upload">
			<UploadShow
				setBreadcrumbs={setBreadcrumbs}
				queryKey={`costsheet-upload-${id}`}
				queryFn={CostsheetService.showBatch}
			/>
		</Layout>
	);
};
