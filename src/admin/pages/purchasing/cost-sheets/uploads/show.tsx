import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { CostsheetService } from '../../../../features/purchasing/cost-sheets/costsheet-service';
import { Layout } from '../../../../components/ui/layout/layout';
import { UploadShow } from '../../../../components/ui/upload-show';
import initialBreadcrumbs from '../../../../features/purchasing/cost-sheets/uploads/breadcrumbs.json';

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
