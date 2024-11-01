import { useState } from '@wordpress/element';
import { useParams } from 'react-router-dom';
import { ProductService } from '../../../../features/catalog/products/product-service';
import { Layout } from '../../../../components/ui/layout/layout';
import { UploadShow } from '../../../../components/ui/upload-show';

export const ProductUploadShow = () => {
	const { id } = useParams();
	const [breadcrumbs, setBreadcrumbs] = useState([
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Products',
			to: `/products`,
		},
		{
			label: 'Product uploads',
			to: `..`,
		},
	]);

	return (
		<Layout breadcrumbs={breadcrumbs} heading="Product upload">
			<UploadShow
				setBreadcrumbs={setBreadcrumbs}
				queryKey={`product-upload-${id}`}
				queryFn={ProductService.showBatch}
			/>
		</Layout>
	);
};
