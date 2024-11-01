import React from 'react';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';
import { BatchUploadIndex } from '../../../components/BatchUploads/BatchUploadIndex';
import { apiURL } from '../../../data/apiURL';
import breadcrumbBase from './breadcrumbs.json';

export const CategoryTreeIndex = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Category tree uploads',
			href: '?page=vf-admin#/catalog/categories/tree',
		},
	];

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<BatchUploadIndex
				url={`${apiURL.CATEGORIES}/tree/batches`}
				linkToNew="?page=vf-admin#/catalog/categories/tree/create"
			/>
		</>
	);
};
