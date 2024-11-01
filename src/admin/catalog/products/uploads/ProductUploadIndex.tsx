import { ProductService } from '../ProductService';
import { Layout } from '../../../layout/Layout';
import { UploadIndex } from '../../../shared/UploadIndex';

export const ProductUploadIndex = () => {
	const action = {
		label: 'Import products',
		to: `create`,
	};

	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Products',
			to: `..`,
		},
		{
			label: 'Imports',
			to: `.`,
		},
	];

	return (
		<Layout heading="Imports" breadcrumbs={breadcrumbs} action={action}>
			<UploadIndex
				queryKey="product-upload-index"
				queryFn={ProductService.indexBatches}
			/>
		</Layout>
	);
};
