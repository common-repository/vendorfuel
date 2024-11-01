import React, { useState } from 'react';
import { vfAPI } from '../../../lib/vfAPI';
import { BatchUploader } from '../../../components/BatchUploads/BatchUploader';
import { apiURL } from '../../../data/apiURL';
import breadcrumbBase from './breadcrumbs.json';
import type { Localized } from '../../../types';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';

declare const localized: Localized;

export const CategoryTreeCreate = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Category tree uploads',
			href: '?page=vf-admin#/catalog/categories/tree',
		},
		{
			label: 'Upload category tree',
			href: `?page=vf-admin#/catalog/categories/tree/create`,
		},
	];
	const templateURL = `${localized.dir.url}assets/downloads/category-tree-upload-template.xlsx`;

	const [isBusy, setBusy] = useState<boolean>(false);
	const [isDisabled, setDisabled] = useState<boolean>(false);

	const handleUpload = (file: File) => {
		store(file);
	};

	const store = (file: File) => {
		setBusy(true);
		const url = `${apiURL.CATEGORIES}/tree/batches`;
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
			<h2>Upload category tree</h2>
			<BatchUploader
				isBusy={isBusy}
				isDisabled={isDisabled}
				handleUpload={handleUpload}
				templateURL={templateURL}
			/>
		</>
	);
};
