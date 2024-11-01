import React from 'react';
import breadcrumbBase from './breadcrumbs.json';
import { BatchUpload } from '../../../components/BatchUploads/BatchUpload';
import { apiURL } from '../../../data/apiURL';

export const CostSheetUploadShow = () => {
	const linkToUploads = '?page=vf-admin#/purchasing/cost-sheets/uploads';

	const breadcrumbs = [
		...breadcrumbBase,
		{ label: 'Uploads', href: linkToUploads },
	];

	return (
		<BatchUpload
			breadcrumbs={breadcrumbs}
			url={apiURL.COSTSHEETS}
			linkToUploads={linkToUploads}
		/>
	);
};
