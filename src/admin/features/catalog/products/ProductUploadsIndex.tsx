import React from 'react';
import { apiURL } from '../../../data/apiURL';
import breadcrumbBase from './breadcrumbs.json';
import { BatchUploadIndex } from '../../../components/BatchUploads/BatchUploadIndex';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';

export const ProductUploadsIndex = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Uploads',
			href: '?page=vf-admin#/catalog/products/uploads',
		},
	];

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<BatchUploadIndex
				url={`${apiURL.PRODUCTS}/batches`}
				linkToNew="?page=vf-admin#/catalog/products/uploads/create"
			/>
		</>
	);
};
