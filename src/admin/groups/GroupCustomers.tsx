import React, { useEffect, useState } from 'react';
import { Flex } from '@wordpress/components';
import PropTypes from 'prop-types';
import { TableControl } from '../components/table/TableControl';
import { TablePagination } from '../components/table/TablePagination';
import { vfAPI } from '../lib/vfAPI';
import type { Localized } from '../types';
import { SearchModal } from '../components/ui/modals/SearchModal';
import { Spinner } from '../components/spinner/Spinner';

declare const localized: Localized;

export const GroupCustomers = (props) => {
	const headers = [
		{ label: 'ID', value: 'id', isId: true },
		{ label: 'Name', value: 'name', isPrimary: true },
		{ label: 'Email', value: 'email' },
		{ label: 'Admin', value: 'group_admin', isBoolean: true },
		{ label: 'Approve', value: 'approver', isBoolean: true },
		{ label: 'Request', value: 'requestor', isBoolean: true },
	];
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	const [isBusy, setBusy] = useState(false);

	const handleAdd = (ids: Array<{ id: number }>) => {
		setBusy(true);
		const data = {
			customers: ids,
		};
		const url = `${nextApiURL}/admin/customers/groups/${props.groupId}`;

		vfAPI.patch(url, data).then((response) => {
			if (!response.data.errors.length) {
				props.handleUpdate();
			}
		});
	};

	const handleChangePage = (page: number) => {
		setBusy(true);
		props.handleChangePage(page);
	};

	const handleRemove = (id: number) => {
		setBusy(true);
		const data = {
			customers: [
				{
					id,
					deleted: true,
				},
			],
		};
		const url = `${nextApiURL}/admin/customers/groups/${props.groupId}`;
		vfAPI.patch(url, data).then((response) => {
			if (!response.data.errors.length) {
				props.handleUpdate();
			}
		});
	};

	/**
	 * Set isBusy to false once prop.customers is updated from parent component.
	 */
	useEffect(() => {
		setBusy(false);
	}, [props.customers]);

	if (!props.customers) {
		return <Spinner />;
	}

	return (
		<>
			{props.customers && (
				<>
					<TableControl
						caption="Customers"
						headers={headers}
						handleRemove={handleRemove}
						indexBase="#!/customers/accounts"
						isBusy={isBusy}
						isIndex
						rows={props.customers.data}
					/>
					<TablePagination
						paginator={props.customers}
						handleChange={handleChangePage}
					/>
				</>
			)}
			<SearchModal
				handleAdd={handleAdd}
				headers={headers}
				model="customers"
				path="customers"
				excludedField="group_id"
				excludedId={props.groupId}
				excludedTable="customers"
			/>
		</>
	);
};

GroupCustomers.propTypes = {
	customers: PropTypes.object, // Paginated customers object.
	groupId: PropTypes.number, // Group ID
	handleUpdate: PropTypes.func, // Callback to trigger refreshing parent component.
	handleChangePage: PropTypes.func, // Callback for sending updated page number to parent component.
};
