import { useState } from '@wordpress/element';
import { vfApi } from '../../../../lib/vf-api';
import { UploadCreate } from '../../../../shared/UploadCreate';
import { Breadcrumb } from '../../../../components/ui/breadcrumb';
import { useNavigate } from 'react-router-dom';

export const ProductUploadCreate = () => {
	const navigate = useNavigate();

	const breadcrumbs = [
		{ label: 'Catalog', to: '/' },
		{ label: 'Products', to: '/products' },
		{
			label: 'Imports',
			to: '..',
		},
		{
			label: 'Import products',
			to: `.`,
		},
	];
	const nextApiURL: string = localized.apiURL.replace('v1', 'v2');
	const templateURL = `${localized.dir.url}assets/downloads/product-upload-template.xlsx`;

	const [isBusy, setBusy] = useState<boolean>(false);
	const [isDisabled, setDisabled] = useState<boolean>(false);

	const handleUpload = (file: File) => {
		storeCustomerUpload(file);
	};

	const storeCustomerUpload = (file: File) => {
		setBusy(true);
		const url = `${nextApiURL}/admin/products/batches`;
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		const data = new FormData();
		data.append('file', file);

		vfApi.post(url, data, config).then((response) => {
			setBusy(false);
			if (response.data?.batch?.id) {
				navigate(`../${response.data.batch.id}`);
			}
		});
	};

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<h1>Import products</h1>
			<UploadCreate
				isBusy={isBusy}
				isDisabled={isDisabled}
				handleUpload={handleUpload}
				templateURL={templateURL}
			/>
		</>
	);
};
