import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { CategoryService } from '../CategoryService';
import { Layout } from '../../../layout/Layout';
import { UploadShow } from '../../../UploadShow';

export const CategoryTreeShow = () => {
	const { id } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useState([
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
	]);

	return (
		<Layout breadcrumbs={breadcrumbs} heading="Category tree upload">
			<UploadShow
				setBreadcrumbs={setBreadcrumbs}
				queryKey={`category-tree-${id}`}
				queryFn={CategoryService.showTreeBatch}
			/>
		</Layout>
	);
};
