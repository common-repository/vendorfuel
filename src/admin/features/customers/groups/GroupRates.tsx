import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TableControl } from '../../../components/table/TableControl';
import { SearchModal } from '../../../components/ui/modals/SearchModal';
import { vfAPI } from '../../../lib/vfAPI';
import type { Localized } from '../../../types';

declare const localized: Localized;

export const GroupRates = (props) => {
	const headers = [
		{ label: 'ID', value: 'id', isId: true },
		{ label: 'Name', value: 'name', isPrimary: true },
		{
			label: 'Amount',
			value: 'amount',
			isCurrency: true,
			type: 'currency',
		},
		{
			label: 'Enabled',
			value: 'enabled',
			isBoolean: true,
			type: 'boolean',
		},
	];
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	const [isBusy, setBusy] = useState(false);

	const handleAdd = (ids: Array<{ id: number }>) => {
		setBusy(true);
		const data = {
			shipping_flat_rates: ids,
		};
		const url = `${nextApiURL}/admin/groups/${props.groupId}`;

		vfAPI.patch(url, data).then((response) => {
			if (!response.data.errors.length) {
				props.handleUpdate();
			}
		});
	};

	const handleRemove = (id: number) => {
		setBusy(true);
		const data = {
			shipping_flat_rates: [
				{
					id,
					deleted: true,
				},
			],
		};
		const url = `${nextApiURL}/admin/groups/${props.groupId}`;
		vfAPI.patch(url, data).then((response) => {
			if (!response.data.errors.length) {
				props.handleUpdate();
			}
		});
	};

	/**
	 * Set isBusy to false once props are updated from parent component.
	 */
	useEffect(() => {
		setBusy(false);
	}, [props.rates]);

	return (
		<>
			<SearchModal
				handleAdd={handleAdd}
				headers={headers}
				model="shipping_flat_rates"
				path="shipping/flat-rate"
				excludedField="group_id"
				excludedId={props.groupId}
				excludedTable="shipping_flat_rate_group"
			/>
			{props.rates && (
				<>
					<TableControl
						caption="Shipping flat rates"
						handleRemove={handleRemove}
						headers={headers}
						isBusy={isBusy}
						rows={props.rates}
					/>
				</>
			)}
		</>
	);
};

GroupRates.propTypes = {
	groupId: PropTypes.number, // Group ID
	handleUpdate: PropTypes.func, // Callback to trigger refreshing parent component.
	rates: PropTypes.array, // Non-paginated flat rates
};
