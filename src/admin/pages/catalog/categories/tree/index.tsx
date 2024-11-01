import { CategoryService } from '../../../../features/catalog/categories/category-service';
import { Layout } from '../../../../components/ui/layout/layout';
import { UploadIndex } from '../../../../shared/UploadIndex';

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
