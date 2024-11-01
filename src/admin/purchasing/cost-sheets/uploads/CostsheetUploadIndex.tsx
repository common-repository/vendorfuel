import { CostsheetService } from '../CostsheetService';
import { Layout } from '../../../layout/Layout';
import { UploadIndex } from '../../../shared/UploadIndex';
import breadcrumbs from './breadcrumbs.json';

export const CostsheetUploadIndex = () => {
	const action = {
		label: 'Upload new',
		to: `create`,
	};

	return (
		<Layout
			heading="Cost sheet uploads"
			breadcrumbs={breadcrumbs}
			action={action}
		>
			<UploadIndex
				queryKey="costsheet-upload-index"
				queryFn={CostsheetService.indexBatches}
			/>
		</Layout>
	);
};
