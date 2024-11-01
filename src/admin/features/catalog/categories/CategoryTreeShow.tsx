import React from 'react';
import breadcrumbBase from './breadcrumbs.json';
import { BatchUpload } from '../../../components/BatchUploads/BatchUpload';
import { apiURL } from '../../../data/apiURL';

export const CategoryTreeShow = () => {
	const linkToUploads = '?page=vf-admin#/catalog/categories/tree';
	const breadcrumbs = [
		...breadcrumbBase,
		{ label: 'Category tree uploads', href: linkToUploads },
	];

	return (
		<BatchUpload
			breadcrumbs={breadcrumbs}
			url={`${apiURL.CATEGORIES}/tree`}
			linkToUploads={linkToUploads}
		/>
	);
};
