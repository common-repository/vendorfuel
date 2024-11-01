import { useEffect, useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import { TableControl } from '../../components/table/TableControl';
import { SearchModal } from '../../components/ui/modals/SearchModal';
import { vfAPI } from '../../shared/vfAPI';
import type { Localized } from '../../types';

declare const localized: Localized;

export const GroupPunchout = (props) => {
	const headers = [
		{ label: 'ID', value: 'id', isId: true },
		{ label: 'Name', value: 'name', isPrimary: true },
		{
			label: 'Price Availability',
			value: 'price_availability',
			isBoolean: true,
			type: 'boolean',
		},
	];
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	const [isBusy, setBusy] = useState(false);
	const [profiles, setProfiles] = useState([]);

	const handleAdd = (ids: Array<{ id: number }>) => {
		setBusy(true);
		const data = {
			punchout_profiles: ids,
		};
		const url = `${nextApiURL}/admin/customers/groups/${props.groupId}`;
		vfAPI.patch(url, data).then((response) => {
			if (!response.data.errors.length) {
				props.handleUpdate();
			}
		});
	};

	const handleRemove = (id: number) => {
		setBusy(true);
		const data = {
			punchout_profiles: [
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
	 * Set a 'flattened' version of the profiles.
	 */
	useEffect(() => {
		setProfiles(
			props.profiles.map((profile) => {
				return {
					id: profile.supplier.id,
					name: profile.supplier.name,
					price_availability: profile.supplier.price_availability,
				};
			})
		);
	}, [props.profiles]);

	/**
	 * Set isBusy to false once prop.customers is updated from parent component.
	 */
	useEffect(() => {
		setBusy(false);
	}, [props.profiles]);

	return (
		<>
			{props.profiles && (
				<>
					<TableControl
						caption="Punchout profiles"
						handleRemove={handleRemove}
						headers={headers}
						isBusy={isBusy}
						rows={profiles}
					/>
				</>
			)}
			<SearchModal
				handleAdd={handleAdd}
				headers={headers}
				model="suppliers"
				path="punchout/suppliers"
			/>
		</>
	);
};

GroupPunchout.propTypes = {
	groupId: PropTypes.number, // Group ID
	handleUpdate: PropTypes.func, // Callback to trigger refreshing parent component.
	profiles: PropTypes.array, // Non-paginated punchout profile
};
