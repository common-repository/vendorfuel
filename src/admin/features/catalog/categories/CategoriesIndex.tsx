import React from 'react';
import { IndexControl } from '../../../components/IndexControl';
import { apiURL } from '../../../data/apiURL';
import breadcrumbs from './breadcrumbs.json';
import { Layout } from '../../../../../resources/js/Shared/Layout';

export const CategoriesIndex = () => {
	const action = {
		label: 'Add new',
		href: '?page=vendorfuel#!/catalog/categories/create',
	};

	const nav = [
		{
			label: 'Upload',
			href: '?page=vf-admin#/catalog/categories/uploads/create',
		},
		{
			label: 'Manage uploads',
			href: '?page=vf-admin#/catalog/categories/uploads',
		},
		{
			label: 'Manage category trees',
			href: '?page=vf-admin#/catalog/categories/tree',
		},
		{
			label: 'Utilities',
			href: '?page=vendorfuel#!/catalog/categories/utilities',
		},
	];

	const headers = [
		{ label: 'ID', value: 'cat_id', isId: true },
		{ label: 'Name', value: 'title', isPrimary: true },
		{ label: 'Description', value: 'description' },
		{ label: 'Parent ID', value: 'parent_id' },
	];

	return (
		<>
			<Layout
				heading="Categories"
				breadcrumbs={breadcrumbs}
				action={action}
				nav={nav}
			>
				<IndexControl
					headers={headers}
					url={apiURL.CATEGORIES}
					orderBy="cat_id"
					model="categories"
					isSearchable={true}
				/>
			</Layout>
		</>
	);
};
