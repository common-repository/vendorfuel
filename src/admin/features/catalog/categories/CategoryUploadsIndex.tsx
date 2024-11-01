import React from 'react';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';
import { BatchUploadIndex } from '../../../components/BatchUploads/BatchUploadIndex';
import { apiURL } from '../../../data/apiURL';
import breadcrumbBase from './breadcrumbs.json';

export const CategoryUploadsIndex = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Uploads',
			href: '?page=vf-admin#/catalog/categories/uploads',
		},
	];

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<BatchUploadIndex
				url={`${apiURL.CATEGORIES}/batches`}
				linkToNew="?page=vf-admin#/catalog/categories/uploads/create"
			/>
		</>
	);
};
