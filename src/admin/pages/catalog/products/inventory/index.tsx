import { useState } from '@wordpress/element';
import { UploadCreate } from '../../../../shared/UploadCreate';
import { Breadcrumb } from '../../../../components/ui/breadcrumb';
import { ProductService } from '../../../../features/catalog/products/product-service';

export const InventoryUploadCreate = () => {
	const breadcrumbs = [
		{ label: 'Catalog', to: '/' },
		{ label: 'Products', to: '..' },
		{
			label: 'Import inventory',
			to: `.`,
		},
	];
	const templateURL = `${localized.dir.url}assets/downloads/inventory-upload-template.xlsx`;

	const [isBusy, setBusy] = useState<boolean>(false);
	const [isDisabled, setDisabled] = useState<boolean>(false);

	const handleUpload = (file: File) => {
		storeCustomerUpload(file);
	};

	const storeCustomerUpload = (file: File) => {
		setBusy(true);
		ProductService.storeInventory(file)
			.then((response) => {
				if (!response.errors.length) {
					setDisabled(true);
				}
			})
			.finally(() => {
				setBusy(false);
			});
	};

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<h1>Import inventory</h1>
			<UploadCreate
				isBusy={isBusy}
				isDisabled={isDisabled}
				handleUpload={handleUpload}
				templateURL={templateURL}
			/>
		</>
	);
};
