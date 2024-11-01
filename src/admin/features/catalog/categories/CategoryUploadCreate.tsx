import React, { useState } from 'react';
import { vfAPI } from '../../../lib/vfAPI';
import { BatchUploader } from '../../../components/BatchUploads/BatchUploader';
import { apiURL } from '../../../data/apiURL';
import breadcrumbBase from './breadcrumbs.json';
import type { Localized } from '../../../types';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';
import { Layout } from '../../../../../resources/js/Shared/Layout';

declare const localized: Localized;

export const CategoryUploadCreate = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Uploads',
			href: '?page=vf-admin#/catalog/categories/uploads',
		},
		{
			label: 'Upload categories',
			href: `?page=vf-admin#/catalog/categories/uploads/create`,
		},
	];
	const templateURL = `${localized.dir.url}assets/downloads/category-upload-template.xlsx`;

	const [isBusy, setBusy] = useState<boolean>(false);
	const [isDisabled, setDisabled] = useState<boolean>(false);

	const handleUpload = (file: File) => {
		storeCustomerUpload(file);
	};

	const storeCustomerUpload = (file: File) => {
		setBusy(true);
		const url = `${apiURL.CATEGORIES}/batches`;
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
		<Layout breadcrumbs={breadcrumbs} heading="Upload categories">
			<BatchUploader
				isBusy={isBusy}
				isDisabled={isDisabled}
				handleUpload={handleUpload}
				templateURL={templateURL}
			/>
		</Layout>
	);
};
