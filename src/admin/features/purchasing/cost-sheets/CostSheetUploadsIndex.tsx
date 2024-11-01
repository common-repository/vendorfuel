import React from 'react';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';
import { BatchUploadIndex } from '../../../components/BatchUploads/BatchUploadIndex';
import { apiURL } from '../../../data/apiURL';
import breadcrumbBase from './breadcrumbs.json';

export const CostSheetUploadsIndex = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Uploads',
			href: '?page=vf-admin#/purchasing/cost-sheets/uploads',
		},
	];

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<BatchUploadIndex
				url={`${apiURL.COSTSHEETS}/batches`}
				linkToNew="?page=vf-admin#/purchasing/cost-sheets/uploads/create"
			/>
		</>
	);
};
