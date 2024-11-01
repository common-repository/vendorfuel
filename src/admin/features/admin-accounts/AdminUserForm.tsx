import { Button, Flex, Modal } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import { vfAPI } from '../../shared/vfAPI';
import { User } from '../../users/User';
import { PasswordControl } from '../../components/form/PasswordControl';
import { apiURL } from '../../data/apiURL';
import { Spinner } from '../../components/spinner/Spinner';

export const AdminUserForm = (props) => {
	const { id, isNew, setBreadcrumbs } = props;

	const [hasResolved, setResolved] = useState<boolean>(false);
	const [hasNewPassword, setNewPassword] = useState<boolean>(false);
	const [isOpen, setOpen] = useState<boolean>(false);
	const [user, setUser] = useState<User>(new User());

	const closeModal = () => setOpen(false);

	/**
	 * Cleans the user from legacy junk.
	 *
	 * @param  input
	 * @return {User} user
	 */
	const cleanedUser = (input): User => {
		return {
			id: input.id,
			name: input.name,
			email: input.email,
			receive_quotes: input.receive_quotes,
			roles: new Set(
				input.roles.map((role: { slug: string }) => role.slug)
			),
		};
	};

	const destroyUser = () => {
		const url = `${apiURL.USERS}/${user.id}`;
		vfAPI.delete(url).then(() => {
			location.assign('?page=vf-users');
		});
	};

	const handleChange = (change: User) => {
		setUser((prev) => {
			return {
				...prev,
				...change,
			};
		});
	};

	const handleDelete = () => {
		setOpen(true);
	};

	const handleSetNewPassword = (e) => {
		e.preventDefault();
		setUser((prev) => {
			return {
				...prev,
				password: '',
				password_confirmation: '',
			};
		});
		setNewPassword(true);
	};

	const handleCancelNewPassword = (e) => {
		e.preventDefault();
		setUser((prev) => {
			return {
				...prev,
				password: null,
				password_confirmation: null,
			};
		});
		setNewPassword(false);
	};

	const handleRoleChange = (value: string) => {
		const tempRoles = new Set(user.roles);
		if (tempRoles.has(value)) {
			tempRoles.delete(value);
		} else {
			tempRoles.add(value);
		}
		setUser((prev) => {
			return {
				...prev,
				roles: new Set([...tempRoles]),
			};
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (id) {
			updateUser();
		} else {
			storeUser();
		}
	};

	const renderRole = (label: string, field: string) => {
		return (
			<p>
				<label htmlFor={field}>
					<input
						name={field}
						type="checkbox"
						id={field}
						checked={user.roles.has(field)}
						onChange={() => {
							handleRoleChange(field);
						}}
					/>
					{` ${label}`}
				</label>
			</p>
		);
	};

	const showUser = (userId: number) => {
		const url = `${apiURL.USERS}/${userId}`;
		vfAPI.get(url).then((response) => {
			if (response.data.admin_user) {
				setUser(cleanedUser(response.data.admin_user));
				setResolved(true);
			}
		});
	};

	const storeUser = () => {
		const url = apiURL.USERS;
		const data = { ...user };

		/* Convert roles from Set back to array before sending to API. */
		data.roles = [...data.roles];

		/* Remove new password if not set, before sending to API. */
		if (user.password === null) {
			delete data.password;
			delete data.password_confirmation;
		}
		vfAPI.post(url, data).then((response) => {
			if (response.data.user_id) {
				location.assign(
					location.href.replace(
						'create',
						response.data.user_id.toString()
					)
				);
			}
		});
	};

	const updateUser = () => {
		const url = `${apiURL.USERS}/${user.id}`;
		const data = { ...user };

		/* Convert roles from Set back to array before sending to API. */
		data.roles = [...data.roles];

		/* Remove new password if not set, before sending to API. */
		if (user.password === null) {
			delete data.password;
			delete data.password_confirmation;
		}
		vfAPI.put(url, data).then(() => {});
	};

	useEffect(() => {
		if (id && !hasResolved) {
			showUser(id);
		}
	}, [props]);

	useEffect(() => {
		if (isNew) {
			setResolved(true);
		}
	}, [isNew]);

	useEffect(() => {
		if (hasResolved) {
			setBreadcrumbs((prev) => {
				const breadcrumbs = [...prev];
				breadcrumbs.push({
					label: user.name || 'Add new',
					href: `?page=vendorfuel#!/admin/${id || 'new'}`,
				});
				return breadcrumbs;
			});
		}
	}, [hasResolved]);

	return (
		<>
			{hasResolved ? (
				<>
					<h1>{id ? 'Edit' : 'Add'} admin account</h1>
					<form onSubmit={handleSubmit}>
						<h2>Name</h2>
						<table className="form-table">
							<tbody>
								<tr>
									<th scope="row">
										<label htmlFor="name">
											Name{' '}
											<span className="description">
												(required)
											</span>
										</label>
									</th>
									<td>
										<input
											className="regular-text"
											type="text"
											name="name"
											id="name"
											onChange={(e) => {
												handleChange({
													name: e.target.value,
												});
											}}
											value={user.name}
										/>
									</td>
								</tr>
							</tbody>
						</table>
						<h2>Contact Info</h2>
						<table className="form-table">
							<tbody>
								<tr>
									<th scope="row">
										<label htmlFor="email">
											Email{' '}
											<span className="description">
												(required)
											</span>
										</label>
									</th>
									<td>
										<input
											className="regular-text"
											type="email"
											name="email"
											id="email"
											onChange={(e) => {
												handleChange({
													email: e.target.value,
												});
											}}
											value={user.email}
										/>
										<p className="description">
											This email address will also be used
											for signing in to VendorFuel.
										</p>
									</td>
								</tr>
							</tbody>
						</table>
						<h2>Account Management</h2>
						<table className="form-table">
							<tbody>
								<tr>
									<th scope="row">Quotes</th>
									<td>
										<label htmlFor="receive_quotes">
											<input
												name="receive_quotes"
												type="checkbox"
												id="receive_quotes"
												checked={user.receive_quotes}
												onChange={() => {
													handleChange({
														receive_quotes:
															!user.receive_quotes,
													});
												}}
											/>{' '}
											Receive copy of customer quotes
										</label>
									</td>
								</tr>
								<tr>
									<th scope="row">New Password</th>
									<td>
										{!hasNewPassword && (
											<Button
												variant="secondary"
												onClick={handleSetNewPassword}
											>
												Set New Password
											</Button>
										)}
										{hasNewPassword && (
											<>
												<Button
													variant="secondary"
													onClick={
														handleCancelNewPassword
													}
												>
													Cancel New Password
												</Button>
												<fieldset>
													<PasswordControl
														label="New Password"
														value={user.password}
														onChange={(
															password
														) => {
															handleChange({
																password,
															});
														}}
														hasValidation
													/>
													<PasswordControl
														label="Confirm Password"
														value={
															user.password_confirmation
														}
														onChange={(
															password_confirmation
														) => {
															handleChange({
																password_confirmation,
															});
														}}
														confirmation={
															user.password
														}
													/>
												</fieldset>
											</>
										)}
									</td>
								</tr>
								<tr>
									<th scope="row">Roles</th>
									<td>
										{renderRole('Billing', 'billing')}
										{renderRole('Developer', 'developer')}
										{renderRole('Manager', 'manager')}
										{renderRole(
											'Customer Service',
											'customer-service'
										)}
										{renderRole('Catalog', 'catalog')}
									</td>
								</tr>
							</tbody>
						</table>
						<Flex justify="start">
							<Button variant="primary" type="submit">
								{id ? 'Update' : 'Save'}
							</Button>
							<Button
								isDestructive
								variant="tertiary"
								type="button"
								onClick={handleDelete}
							>
								Delete
							</Button>
						</Flex>
					</form>
				</>
			) : (
				<Spinner />
			)}
			{isOpen && (
				<Modal
					title="Deactivate this admin user"
					onRequestClose={closeModal}
				>
					<p>This will deactivate this admin user.</p>
					<Flex justify="end">
						<button
							className="btn btn-outline-primary"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							className="btn btn-danger"
							onClick={destroyUser}
						>
							Delete
						</button>
					</Flex>
				</Modal>
			)}
		</>
	);
};

AdminUserForm.propTypes = {
	id: PropTypes.number,
	isNew: PropTypes.bool,
	setBreadcrumbs: PropTypes.func,
};
