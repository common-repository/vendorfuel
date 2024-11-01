import { Button, Flex } from '@wordpress/components';
import React from 'react';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';
import { Layout } from '../../../../../resources/js/Shared/Layout';
import { IndexControl } from '../../../components/IndexControl';

export const AccountsIndex = () => {
	const breadcrumbs = [
		{ label: 'Customers', href: '?page=vf-admin#/customers' },
		{ label: 'Accounts', href: '?page=vendorfuel#!/customers/accounts' },
	];
	const headers = [
		{ label: 'ID', value: 'id', isId: true },
		{ label: 'Name', value: 'name', isPrimary: true },
		{ label: 'Email', value: 'email' },
		{ label: 'Status', value: 'status', isBadge: true },
	];
	const nextApiURL = localized.apiURL.replace('v1', 'v2');
	const searchByOptions = [
		{ label: 'ID', value: 'id' },
		{ label: 'Name', value: 'name' },
		{ label: 'Email', value: 'email' },
	];

	const action = {
		label: 'Add new',
		href: '?page=vendorfuel#!/customers/accounts/create',
	};

	const nav = [
		{
			label: 'Upload',
			href: '?page=vf-admin#/customers/accounts/uploads/create',
		},
		{
			label: 'Manage uploads',
			href: '?page=vf-admin#/customers/accounts/uploads',
		},
		{
			label: 'Settings',
			href: '?page=vendorfuel#!/customers/accounts/settings',
		},
	];

	return (
		<Layout
			breadcrumbs={breadcrumbs}
			heading="Accounts"
			action={action}
			nav={nav}
		>
			<IndexControl
				headers={headers}
				url={`${nextApiURL}/admin/customers`}
				orderBy="id"
				model="customers"
				isSearchable={true}
				searchByOptions={searchByOptions}
			/>
		</Layout>
	);
};
