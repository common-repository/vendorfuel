import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, TabPanel } from '@wordpress/components';

import { GroupCustomers } from './GroupCustomers';
import { GroupNotes } from './GroupNotes';
import { GroupRates } from './GroupRates';
import { GroupPunchout } from './GroupPunchout';
import { GroupChildGroups } from './GroupChildGroups';

export const GroupTabs = (props) => {
	const tabs = [
		{
			name: 'customers',
			title: 'Customers',
		},
		{
			name: 'children',
			title: 'Child groups',
		},
		{
			name: 'rates',
			title: 'Shipping flat rates',
		},
		{
			name: 'punchout',
			title: 'Punchout',
		},
		{
			name: 'notes',
			title: 'Notes',
		},
	];

	const renderTab = (tab: string) => {
		switch (tab) {
			case 'customers':
				return (
					<GroupCustomers
						groupId={props.group.group_id}
						customers={props.group.customers}
						handleUpdate={props.handleUpdate}
						handleChangePage={props.handleChangePage}
					/>
				);
			case 'children':
				return (
					<GroupChildGroups childGroups={props.group.child_groups} />
				);
			case 'rates':
				return (
					<GroupRates
						groupId={props.group.group_id}
						handleUpdate={props.handleUpdate}
						rates={props.group.flatrates}
					/>
				);
			case 'punchout':
				return (
					<GroupPunchout
						groupId={props.group.group_id}
						handleUpdate={props.handleUpdate}
						profiles={props.group.punchout_profiles}
					/>
				);
			case 'notes':
				return <GroupNotes groupId={props.group.group_id} />;
			default:
				return <></>;
		}
	};

	return (
		<>
			{props.group && (
				<TabPanel tabs={tabs}>
					{(tab) => (
						<Card>
							<CardBody>{renderTab(tab.name)}</CardBody>
						</Card>
					)}
				</TabPanel>
			)}
		</>
	);
};

GroupTabs.propTypes = {
	group: PropTypes.object, // Paginated customers object.
	handleUpdate: PropTypes.func, // Callback to trigger refreshing parent component.
	handleChangePage: PropTypes.func, // Callback for sending updated page number to parent component.
};
