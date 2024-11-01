import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { CategoryService } from '../CategoryService';
import { Layout } from '../../../layout/Layout';
import { UploadShow } from '../../../UploadShow';

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
