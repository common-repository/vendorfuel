import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { CategoryService } from '../../../../features/catalog/categories/category-service';
import { Layout } from '../../../../components/ui/layout/layout';
import { UploadShow } from '../../../../components/ui/upload-show';

export const CategoryUploadShow = () => {
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
			label: 'Category uploads',
			to: `.`,
		},
	]);

	return (
		<Layout breadcrumbs={breadcrumbs} heading="Category upload">
			<UploadShow
				setBreadcrumbs={setBreadcrumbs}
				queryKey={`category-upload-${id}`}
				queryFn={CategoryService.showBatch}
			/>
		</Layout>
	);
};
