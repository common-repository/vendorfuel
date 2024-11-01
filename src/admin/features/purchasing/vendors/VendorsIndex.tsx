import React from 'react';
import { Flex } from '@wordpress/components';
import { IndexControl } from '../../../components/IndexControl';
import { apiURL } from '../../../data/apiURL';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';
import { Layout } from '../../../../../resources/js/Shared/Layout';

export const VendorsIndex = () => {
	const action = {
		label: 'Add new',
		href: '?page=vendorfuel#!/purchasing/vendors/create',
	};
	const breadcrumbs = [
		{ label: 'Purchasing', href: '?page=vf-admin#/purchasing' },
		{ label: 'Vendors', href: '?page=vendorfuel#!/purchasing/vendors' },
	];
	const headers = [
		{ label: 'ID', value: 'id', isId: true },
		{ label: 'Name', value: 'name', isPrimary: true },
		{ label: 'Lead time', value: 'lead_time' },
		{ label: 'Location', value: 'location' },
	];

	return (
		<Layout breadcrumbs={breadcrumbs} heading="Vendors" action={action}>
			<IndexControl
				headers={headers}
				url={apiURL.VENDORS}
				orderBy="id"
				model="vendors"
				isSearchable={true}
			/>
		</Layout>
	);
};
