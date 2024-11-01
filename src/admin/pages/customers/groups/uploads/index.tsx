import { GroupService } from '../../../../features/customers/groups/group-service';
import { Layout } from '../../../../components/ui/layout/layout';
import { UploadIndex } from '../../../../shared/UploadIndex';
import breadcrumbs from '../../../../features/customers/groups/uploads/breadcrumbs.json';

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
