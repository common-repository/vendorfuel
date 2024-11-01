import { useState } from '@wordpress/element';
import { Layout } from '../../../../components/ui/layout/layout';
import { ProductExportService } from '../../../../features/catalog/products/product-export-service';
import { Button } from '@wordpress/components';

export const ExportCreate = () => {
	const breadcrumbs = [
		{
			label: 'Catalog',
			to: `/`,
		},
		{
			label: 'Products',
			to: `/products`,
		},
		{
			label: 'Exports',
			to: `..`,
		},
		{
			label: 'Export products',
			to: `.`,
		},
	];
	const handleClick = () => {
		setBusy(true);
		ProductExportService.startExport().then(() => {
			setBusy(false);
		});
	};
	const [isBusy, setBusy] = useState<boolean>(false);

	return (
		<Layout heading="Export all products" breadcrumbs={breadcrumbs}>
			<Button variant="primary" onClick={handleClick} isBusy={isBusy}>
				Export
			</Button>
		</Layout>
	);
};
