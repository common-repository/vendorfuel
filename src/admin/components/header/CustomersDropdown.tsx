import { Button, Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import React from '@wordpress/element';

export const CustomersDropdown = () => {
	const rootURL = `${location.origin}${location.pathname}`;

	const handleSelect = (route: string, onClose) => {
		const url = `${rootURL}?page=vendorfuel#!/customers/${route}`;
		location.assign(url);
		onClose();
	};

	return (
		<Dropdown
			renderToggle={({ isOpen, onToggle }) => (
				<Button
					variant="tertiary"
					onClick={onToggle}
					aria-expanded={isOpen}
				>
					Customers
				</Button>
			)}
			renderContent={({ onClose }) => (
				<MenuGroup label="Customers">
					<MenuItem onClick={() => handleSelect('accounts', onClose)}>
						Accounts
					</MenuItem>
					<MenuItem onClick={() => handleSelect('groups', onClose)}>
						Groups
					</MenuItem>
					<MenuItem onClick={() => handleSelect('roles', onClose)}>
						Roles
					</MenuItem>
				</MenuGroup>
			)}
		/>
	);
};
