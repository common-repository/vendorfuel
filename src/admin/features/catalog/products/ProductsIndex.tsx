import React from 'react';
import { IndexControl } from '../../../components/IndexControl';
import { Layout } from '../../../../../resources/js/Shared/Layout';

export const ProductsIndex = () => {
	const action = {
		label: 'Add new',
		href: '?page=vendorfuel#!catalog/products/create',
	};

	const nav = [
		{
			label: 'Upload',
			href: '?page=vendorfuel#!catalog/products/uploads/create',
		},
		{
			label: 'Manage uploads',
			href: '?page=vendorfuel#!catalog/products/uploads',
		},
		{
			label: 'Utilities',
			href: '?page=vendorfuel#!catalog/products/utilities',
		},
	];

	const breadcrumbs = [
		{ label: 'Catalog', href: '?page=vf-admin#/catalog' },
		{ label: 'Products', href: '?page=vendorfuel#!/catalog/products' },
	];
	const headers = [
		{ label: 'ID', value: 'product_id', isId: true },
		{ label: 'Name', value: 'description', isPrimary: true },
		{ label: 'SKU', value: 'sku' },
		{ label: 'Status', value: 'status', isBadge: true },
	];
	const nextApiURL = localized.apiURL.replace('v1', 'v2');
	const searchByOptions = [
		{ label: 'ID', value: 'product_id' },
		{ label: 'Name', value: 'description' },
		{ label: 'SKU', value: 'sku' },
	];

	return (
		<Layout
			heading="Products"
			breadcrumbs={breadcrumbs}
			action={action}
			nav={nav}
		>
			<IndexControl
				headers={headers}
				url={`${nextApiURL}/admin/products`}
				orderBy="product_id"
				model="products"
				isSearchable={true}
				searchByOptions={searchByOptions}
				hasImage={true}
			/>
		</Layout>
	);
};
