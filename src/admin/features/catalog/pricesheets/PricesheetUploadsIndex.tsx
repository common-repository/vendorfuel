import React from 'react';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';
import { BatchUploadIndex } from '../../../components/BatchUploads/BatchUploadIndex';
import { apiURL } from '../../../data/apiURL';
import breadcrumbBase from './breadcrumbs.json';

export const PricesheetUploadsIndex = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Uploads',
			href: '?page=vf-admin#/catalog/pricesheets/uploads',
		},
	];

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<BatchUploadIndex
				url={`${apiURL.PRICESHEETS}/batches`}
				linkToNew="?page=vf-admin#/catalog/pricesheets/uploads/create"
			/>
		</>
	);
};
