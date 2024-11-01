import { GroupService } from '../GroupService';
import { Layout } from '../../../layout/Layout';
import { UploadIndex } from '../../../shared/UploadIndex';
import breadcrumbs from './breadcrumbs.json';

export const GroupUploadIndex = () => {
	const action = {
		label: 'Upload new',
		href: `?page=vf-customers#/groups/uploads/create`,
	};

	return (
		<Layout
			heading="Group uploads"
			breadcrumbs={breadcrumbs}
			action={action}
		>
			<UploadIndex
				queryKey="group-upload-index"
				queryFn={GroupService.indexBatches}
			/>
		</Layout>
	);
};
