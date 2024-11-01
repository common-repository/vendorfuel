import React from 'react';
import PropTypes from 'prop-types';
import { TableControl } from '../components/table/TableControl';

export const GroupChildGroups = (props) => {
	const headers = [
		{ label: 'ID', value: 'group_id', isId: true },
		{ label: 'Name', value: 'name', isPrimary: true },
		{ label: 'Default price sheet ID', value: 'default_price_sheet' },
	];

	return (
		<>
			{props.childGroups && (
				<>
					<TableControl
						caption="Child groups"
						headers={headers}
						isIndex
						indexBase="#!/customers/groups"
						rows={props.childGroups}
					/>
				</>
			)}
		</>
	);
};

GroupChildGroups.propTypes = {
	childGroups: PropTypes.array, // Non-paginated child groups
};
