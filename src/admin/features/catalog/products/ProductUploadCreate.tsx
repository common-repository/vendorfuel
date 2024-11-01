import React, { useState } from 'react';
import { vfAPI } from '../../../lib/vfAPI';
import { BatchUploader } from '../../../components/BatchUploads/BatchUploader';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';

export const ProductUploadCreate = () => {
	const breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-admin#/catalog' },
		{ label: 'Products', href: '?page=vendorfuel#!/catalog/products' },
		{
			label: 'Uploads',
			href: '?page=vf-admin#/catalog/products/uploads',
		},
		{
			label: 'Add new',
			href: `?page=vf-admin#/catalog/products/uploads/create`,
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
		vfAPI.post(url, data, config).then((response) => {
			setBusy(false);
			if (response.data?.batch?.id) {
				location.assign(
					location.href.replace(
						'create',
						response.data.batch.id.toString()
					)
				);
			}
		});
	};

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<h2>Add upload</h2>
			<BatchUploader
				isBusy={isBusy}
				isDisabled={isDisabled}
				handleUpload={handleUpload}
				templateURL={templateURL}
			/>
		</>
	);
};
