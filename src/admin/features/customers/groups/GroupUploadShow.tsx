import React from 'react';
import breadcrumbBase from './breadcrumbs.json';
import { BatchUpload } from '../../../components/BatchUploads/BatchUpload';
import { apiURL } from '../../../data/apiURL';

export const GroupUploadShow = () => {
	const linkToUploads = '?page=vf-admin#/customers/groups/uploads';
	const breadcrumbs = [
		...breadcrumbBase,
		{ label: 'Uploads', href: linkToUploads },
	];

	return (
		<BatchUpload
			breadcrumbs={breadcrumbs}
			url={apiURL.GROUPS}
			linkToUploads={linkToUploads}
		/>
	);
};
