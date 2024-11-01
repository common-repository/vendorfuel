import { CostsheetService } from '../../../../features/purchasing/cost-sheets/costsheet-service';
import { Layout } from '../../../../components/ui/layout/layout';
import { UploadIndex } from '../../../../shared/UploadIndex';
import breadcrumbs from '../../../../features/purchasing/cost-sheets/uploads/breadcrumbs.json';

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
