import React from 'react';
import { IndexControl } from '../../components/IndexControl';
import { apiURL } from '../../data/apiURL';
import { Layout } from '../../../../resources/js/Shared/Layout';

export const AdminAccountsIndex = () => {
	const action = {
		label: 'Add new',
		href: `?page=vendorfuel#!/admin/create`,
	};
	const headers = [
		{ label: 'ID', value: 'id', isId: true },
		{ label: 'Name', value: 'name', isPrimary: true },
		{ label: 'Email', value: 'email' },
	];

	return (
		<>
			<Layout heading="Admin accounts" action={action}>
				<IndexControl
					headers={headers}
					url={apiURL.USERS}
					orderBy="id"
					model="admin_users"
					isSearchable={true}
				/>
			</Layout>
		</>
	);
};
