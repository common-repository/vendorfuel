import { CategoryService } from '../CategoryService';
import { Layout } from '../../../layout/Layout';
import { UploadIndex } from '../../../shared/UploadIndex';

export const CategoryTreeIndex = () => {
	const action = {
		label: 'Upload new',
		to: `create`,
	};

	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Categories',
			to: `..`,
		},
		{
			label: 'Category tree uploads',
			to: `.`,
		},
	];

	return (
		<Layout
			heading="Category tree uploads"
			breadcrumbs={breadcrumbs}
			action={action}
		>
			<UploadIndex
				queryKey="category-tree-index"
				queryFn={CategoryService.indexTreeBatches}
			/>
		</Layout>
	);
};
