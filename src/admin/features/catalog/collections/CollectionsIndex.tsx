import React from 'react';
import { IndexControl } from '../../../components/IndexControl';
import { apiURL } from '../../../data/apiURL';
import breadcrumbs from './breadcrumbs.json';
import { Layout } from '../../../../../resources/js/Shared/Layout';

export const CollectionsIndex = () => {
	const headers = [
		{ label: 'ID', value: 'id', isId: true },
		{ label: 'Name', value: 'name', isPrimary: true },
		{ label: 'Description', value: 'description' },
	];

	const action = {
		label: 'Add new',
		href: '?page=vendorfuel#!/catalog/collections/create',
	};

	return (
		<Layout heading="Categories" breadcrumbs={breadcrumbs} action={action}>
			<IndexControl
				headers={headers}
				url={apiURL.COLLECTIONS}
				orderBy="id"
				model="collections"
				isSearchable={true}
			/>
		</Layout>
	);
};
