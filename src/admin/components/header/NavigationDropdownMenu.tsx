import React from '@wordpress/element';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { login, moreVertical } from '@wordpress/icons';
import PropTypes from 'prop-types';

export const NavigationDropdownMenu = (props) => {
	const { isAuthed } = props;
	const rootURL = `${location.origin}${location.pathname}`;

	const handleSelect = (route: string, onClose) => {
		const url = `${rootURL}?page=${route}`;
		location.assign(url);
		onClose();
	};

	const handleSelectDocs = () => {
		const url = 'https://docs.vendorfuel.com/';
		window.open(url, '_blank');
	};

	const handleSelectContact = () => {
		const url = 'https://vendorfuel.com/contact';
		window.open(url, '_blank');
	};

	return (
		<DropdownMenu icon={moreVertical} label="Navigation">
			{({ onClose }) => (
				<>
					{!isAuthed && (
						<MenuGroup>
							<MenuItem
								icon={login}
								onClick={() =>
									handleSelect('vendorfuel#!/login', onClose)
								}
							>
								Sign in
							</MenuItem>
						</MenuGroup>
					)}
					{isAuthed && (
						<>
							<MenuGroup>
								<MenuItem
									onClick={() =>
										handleSelect(
											'vendorfuel#!/purchasing',
											onClose
										)
									}
									info="Manage cost sheets, document profiles and vendors."
								>
									Purchasing
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleSelect(
											'vendorfuel#!/punchout',
											onClose
										)
									}
									info="Manage suppliers."
								>
									Punchout
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleSelect(
											'vendorfuel#!/shipping',
											onClose
										)
									}
									info="Manage shipping mode, flat rates and parcels."
								>
									Shipping
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleSelect(
											'vendorfuel#!/email',
											onClose
										)
									}
								>
									Email
								</MenuItem>
							</MenuGroup>
							<MenuGroup label="Finance">
								<MenuItem
									onClick={() =>
										handleSelect('vf-accounting', onClose)
									}
								>
									Accounting
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleSelect(
											'vendorfuel#!/payments',
											onClose
										)
									}
								>
									Payments
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleSelect(
											'vendorfuel#!/taxes',
											onClose
										)
									}
								>
									Taxes
								</MenuItem>
							</MenuGroup>
						</>
					)}
					<MenuGroup label="Administration">
						{isAuthed && (
							<>
								<MenuItem
									onClick={() =>
										handleSelect(
											'vendorfuel#!/admin',
											onClose
										)
									}
								>
									Admin accounts
								</MenuItem>
								<MenuItem
									onClick={() =>
										handleSelect(
											'vendorfuel#!/billing',
											onClose
										)
									}
								>
									Billing
								</MenuItem>
							</>
						)}
						<MenuItem
							onClick={() =>
								handleSelect('vendorfuel#!/settings', onClose)
							}
						>
							Settings
						</MenuItem>
					</MenuGroup>
					<MenuGroup label="Support">
						<MenuItem icon="editor-help" onClick={handleSelectDocs}>
							Documentation
						</MenuItem>
						<MenuItem icon="email" onClick={handleSelectContact}>
							Contact us
						</MenuItem>
					</MenuGroup>
					{isAuthed && (
						<MenuGroup>
							<MenuItem
								icon="exit"
								onClick={() =>
									handleSelect('vf-signout', onClose)
								}
							>
								Sign out
							</MenuItem>
						</MenuGroup>
					)}
				</>
			)}
		</DropdownMenu>
	);
};

NavigationDropdownMenu.propTypes = {
	isAuthed: PropTypes.bool,
};
