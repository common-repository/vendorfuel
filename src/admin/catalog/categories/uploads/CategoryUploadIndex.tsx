import { CategoryService } from '../CategoryService';
import { Layout } from '../../../layout/Layout';
import { UploadIndex } from '../../../shared/UploadIndex';

export const CategoryUploadIndex = () => {
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
			label: 'Category uploads',
			to: `.`,
		},
	];

	return (
		<Layout
			heading="Category uploads"
			breadcrumbs={breadcrumbs}
			action={action}
		>
			<UploadIndex
				queryKey="category-upload-index"
				queryFn={CategoryService.indexBatches}
			/>
		</Layout>
	);
};
