import React from 'react';
import breadcrumbBase from './breadcrumbs.json';
import { BatchUpload } from '../../../components/BatchUploads/BatchUpload';
import { apiURL } from '../../../data/apiURL';

export const AccountUploadShow = () => {
	const linkToUploads = '?page=vf-admin#/customers/accounts/uploads';
	const breadcrumbs = [
		...breadcrumbBase,
		{ label: 'Uploads', href: linkToUploads },
	];

	return (
		<BatchUpload
			breadcrumbs={breadcrumbs}
			url={apiURL.CUSTOMERS}
			linkToUploads={linkToUploads}
		/>
	);
};
