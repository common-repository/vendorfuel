import React from 'react';
import { Button, Flex } from '@wordpress/components';
import { IndexControl } from '../../../components/IndexControl';
import { Breadcrumb } from '../../../../../resources/js/Shared/Breadcrumb';
import { Layout } from '../../../../../resources/js/Shared/Layout';

export const PricesheetsIndex = () => {
	const action = {
		label: 'Add new',
		href: '?page=vendorfuel#!/catalog/pricesheets/create',
	};
	const breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-admin#/catalog' },
		{
			label: 'Price sheets',
			href: '?page=vendorfuel#!/catalog/pricesheets',
		},
	];
	const headers = [
		{ label: 'ID', value: 'price_sheet_id', isId: true },
		{ label: 'Name', value: 'sheet', isPrimary: true },
		{ label: 'Site ID', value: 'site_id' },
		{ label: 'GP Price Sheet', value: 'gp_price_sheet' },
	];
	const nav = [
		{
			label: 'Upload',
			href: '?page=vf-admin#/catalog/pricesheets/uploads/create',
		},
		{
			label: 'Manage uploads',
			href: '?page=vf-admin#/catalog/pricesheets/uploads',
		},
	];
	const nextApiURL = localized.apiURL.replace('v1', 'v2');
	const searchByOptions = [
		{ label: 'ID', value: 'price_sheet_id' },
		{ label: 'Name', value: 'sheet' },
		{ label: 'Site ID', value: 'site_id' },
		{ label: 'GP Price Sheet', value: 'gp_price_sheet' },
	];

	return (
		<Layout
			breadcrumbs={breadcrumbs}
			heading="Price sheets"
			action={action}
			nav={nav}
		>
			<IndexControl
				headers={headers}
				url={`${nextApiURL}/admin/pricesheets`}
				orderBy="price_sheet_id"
				model="pricesheets"
				isSearchable={true}
				searchByOptions={searchByOptions}
			/>
		</Layout>
	);
};
