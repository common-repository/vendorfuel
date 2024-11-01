import React from 'react';
import breadcrumbBase from './breadcrumbs.json';
import { BatchUpload } from '../../../components/BatchUploads/BatchUpload';
import { apiURL } from '../../../data/apiURL';

export const ProductUploadShow = () => {
	const linkToUploads = '?page=vf-admin#/catalog/products/uploads';
	const breadcrumbs = [
		...breadcrumbBase,
		{ label: 'Uploads', href: linkToUploads },
	];

	return (
		<BatchUpload
			breadcrumbs={breadcrumbs}
			url={apiURL.PRODUCTS}
			linkToUploads={linkToUploads}
		/>
	);
};
