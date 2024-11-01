import React from 'react';
import breadcrumbBase from './breadcrumbs.json';
import { BatchUpload } from '../../../components/BatchUploads/BatchUpload';
import { apiURL } from '../../../data/apiURL';

export const PricesheetUploadShow = () => {
	const linkToUploads = '?page=vf-admin#/catalog/pricesheets/uploads';

	const breadcrumbs = [
		...breadcrumbBase,
		{ label: 'Uploads', href: linkToUploads },
	];

	return (
		<BatchUpload
			breadcrumbs={breadcrumbs}
			url={apiURL.PRICESHEETS}
			linkToUploads={linkToUploads}
		/>
	);
};
