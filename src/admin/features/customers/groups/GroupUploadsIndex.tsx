import React from 'react';
import { apiURL } from '../../../data/apiURL';
import { BatchUploadIndex } from '../../../components/BatchUploads/BatchUploadIndex';
import breadcrumbBase from './breadcrumbs.json';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';

export const GroupUploadsIndex = () => {
	const breadcrumbs = [
		...breadcrumbBase,
		{
			label: 'Uploads',
			href: '?page=vf-admin#/customers/groups/uploads',
		},
	];

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<BatchUploadIndex
				url={`${apiURL.GROUPS}/batches`}
				linkToNew="?page=vf-admin#/customers/groups/uploads/create"
			/>
		</>
	);
};
