import React from 'react';
import { Button, Flex } from '@wordpress/components';
import { IndexControl } from '../../../components/IndexControl';
import { apiURL } from '../../../data/apiURL';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';
import { Layout } from '../../../../../resources/js/Shared/Layout';

export const GroupsIndex = () => {
	const breadcrumbs = [
		{ label: 'Customers', href: '?page=vf-admin#/customers' },
		{ label: 'Groups', href: '?page=vendorfuel#!/customers/groups' },
	];
	const headers = [
		{ label: 'ID', value: 'group_id', isId: true },
		{ label: 'Name', value: 'name', isPrimary: true },
		{ label: 'Parent group ID', value: 'parent_group_id' },
		{
			label: 'Default price sheet ID',
			value: 'default_price_sheet',
		},
	];

	const action = {
		label: 'Add new',
		href: '?page=vendorfuel#!/customers/groups/create',
	};

	const nav = [
		{
			label: 'Upload',
			href: '?page=vf-admin#/customers/groups/uploads/create',
		},
		{
			label: 'Manage uploads',
			href: '?page=vf-admin#/customers/groups/uploads',
		},
	];

	return (
		<Layout
			breadcrumbs={breadcrumbs}
			heading="Groups"
			action={action}
			nav={nav}
		>
			<IndexControl
				headers={headers}
				url={apiURL.GROUPS}
				orderBy="group_id"
				model="groups"
				isSearchable={true}
			/>
		</Layout>
	);
};
