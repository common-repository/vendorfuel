import { useEffect, useState } from '@wordpress/element';
import {
	BaseControl,
	Button,
	Card,
	CardBody,
	CardHeader,
	CheckboxControl,
	ComboboxControl,
	Flex,
	FormTokenField,
	Modal,
	TabPanel,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { debounce } from 'lodash';
import { vfAPI } from '../../../shared/vfAPI';
import { Role } from '../../../customers/roles/Role';
import { convertToComboOptions } from '../../../utils/convertToComboOptions';
import { apiURL } from '../../../data/apiURL';
import { Breadcrumb } from '../../../shared/Breadcrumb';

interface Props {
	roleId: number;
	isNew: boolean;
}

const tabs = [
	{
		name: 'options',
		title: 'Options',
	},
	{
		name: 'documents',
		title: 'Documents',
	},
];

export const RoleEdit = ({ isNew, roleId }: Props) => {
	const [breadcrumbs, setBreadcrumbs] = useState([
		{ label: 'Customers', href: '?page=vf-customers' },
		{ label: 'Roles', href: '?page=vf-customers#/roles' },
	]);
	const [groups, setGroups] = useState([]);
	const [groupsQuery, setGroupsQuery] = useState<string>();
	const [isBusy, setIsBusy] = useState<boolean>(true);
	const [isOpen, setOpen] = useState(false);
	const [priceSheets, setPriceSheets] = useState([]);
	const [role, setRole] = useState<Role>({});
	const [domains, setDomains] = useState([]);

	const addDocument = () => {
		const newDocument = {
			name: '',
			required: false,
		};

		const updatedDocuments = role.documents
			? [...role.documents, newDocument]
			: [newDocument];
		setRole({ ...role, documents: updatedDocuments });
	};

	const closeModal = () => setOpen(false);

	const deleteDocument = (index: number) => {
		const updatedDocuments = role.documents;
		updatedDocuments.splice(index, 1);
		setRole({ ...role, documents: updatedDocuments });
	};

	const deleteRole = () => {
		setIsBusy(true);
		vfAPI.delete(`${apiURL.ROLES}/${role.id}`).then((response) => {
			if (!response.data.errors.length) {
				location.assign(
					location.href.replace(`/${role.id.toString()}`, '')
				);
			}
		});
	};

	const handleGroupQueryChange = debounce((value: string) => {
		setGroupsQuery(value);
	}, 500);

	const getGroups = () => {
		const params: { q?: string } = {};
		if (groupsQuery) {
			params.q = groupsQuery;
		}
		const config = {
			params,
		};

		vfAPI.get(apiURL.GROUPS, config).then((response) => {
			if (!response.data.errors.length) {
				setGroups(
					convertToComboOptions({
						data: response.data.groups.data,
						labelKey: 'name',
						valueKey: 'group_id',
					})
				);
			}
		});
	};

	const getPriceSheets = () => {
		setIsBusy(true);
		const config = {
			params: {
				rpp: 500, // Override pagination
			},
		};
		vfAPI.get(apiURL.PRICESHEETS, config).then((response) => {
			if (!response.data.errors.length) {
				setPriceSheets(
					convertToComboOptions({
						data: response.data.pricesheets.data,
						labelKey: 'sheet',
						valueKey: 'price_sheet_id',
					})
				);
				setIsBusy(false);
			}
		});
	};

	const getRole = (id: number) => {
		setIsBusy(true);
		vfAPI.get(`${apiURL.ROLES}/${id}`).then((response) => {
			if (!response.data.errors.length) {
				setBreadcrumbs([
					...breadcrumbs,
					{
						label: response.data.role.name,
						href: `?page=vendorfuel#!/customers/roles/${roleId}`,
					},
				]);
				setRole(response.data.role);
				setDomains(
					response.data.role.allowed_email_domains
						? response.data.role.allowed_email_domains
						: []
				);
				setPriceSheets(
					convertToComboOptions({
						data: response.data.price_sheets,
						labelKey: 'sheet',
						valueKey: 'price_sheet_id',
					})
				);
			}
			setIsBusy(false);
		});
	};

	const openModal = () => setOpen(true);

	const save = () => {
		setIsBusy(true);
		vfAPI.post(apiURL.ROLES, role).then((response) => {
			if (response.data?.role?.id) {
				location.assign(
					location.href.replace(
						'create',
						response.data.role.id.toString()
					)
				);
			}
			setIsBusy(false);
		});
	};

	const setDocument = (
		document: { name: string; required: boolean },
		index: number
	) => {
		const updatedDocuments = [...role.documents];
		updatedDocuments[index] = document;
		setRole({ ...role, documents: updatedDocuments });
	};

	const submit = (e) => {
		e.preventDefault();
		if (isNew) {
			save();
		} else {
			update();
		}
	};

	const update = () => {
		setIsBusy(true);
		vfAPI.put(`${apiURL.ROLES}/${role.id}`, role).then((response) => {
			if (!response.data.errors.length) {
				setRole(response.data.role);
			}
			setIsBusy(false);
		});
	};

	// Get Groups when page loads and query changes.
	useEffect(() => {
		getGroups();
	}, [groupsQuery]);

	// Get Role if a role ID is passed via props.
	useEffect(() => {
		if (roleId) {
			getRole(roleId);
		}
	}, [roleId]);

	// Initialize breadcrumb and price sheets if new role.
	useEffect(() => {
		if (isNew) {
			setBreadcrumbs([
				...breadcrumbs,
				{
					label: 'Add New',
					href: '?page=vendorfuel#!/customers/roles/create',
				},
			]);
			getPriceSheets();
		}
	}, [isNew]);

	// Update allowed domains when changed. Fixes issue where null value causes FormTokenField component to break.
	useEffect(() => {
		if (domains) {
			setRole({ ...role, allowed_email_domains: domains });
		}
	}, [domains]);

	// Redirect from "Add New" to "Edit" route if a role is saved for the first time.
	useEffect(() => {
		if (isNew && role.id) {
			location.assign(
				location.href.replace('create', role.id.toString())
			);
		}
	}, [role]);

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<h2>{isNew ? 'Add New' : 'Edit'} role</h2>
			<form onSubmit={submit}>
				<fieldset disabled={isBusy}>
					<div className="row">
						<div className="col-lg-4">
							<fieldset>
								<TextControl
									label="Name (required)"
									value={role.name}
									onChange={(value) =>
										setRole({ ...role, name: value })
									}
									required
								/>
								<ComboboxControl
									label="Price Sheet"
									options={priceSheets}
									value={role.price_sheet_id}
									onChange={(value) =>
										setRole({
											...role,
											price_sheet_id: value,
										})
									}
								/>
								<ComboboxControl
									label="Group"
									options={groups}
									value={role.group_id}
									onChange={(value) =>
										setRole({ ...role, group_id: value })
									}
									onFilterValueChange={handleGroupQueryChange}
								/>
								<TextControl
									label="Order Prefix"
									value={role.order_prefix}
									onChange={(value) =>
										setRole({
											...role,
											order_prefix: value,
										})
									}
								/>
								<TextControl
									label="Terms"
									value={role.terms}
									onChange={(value) =>
										setRole({ ...role, terms: value })
									}
								/>
								<TextControl
									label="Customer Class"
									value={role.customer_class}
									onChange={(value) =>
										setRole({
											...role,
											customer_class: value,
										})
									}
								/>
								<CheckboxControl
									label="Available During Registration"
									checked={role.registration}
									onChange={(value) =>
										setRole({
											...role,
											registration: value,
										})
									}
								/>
							</fieldset>
							<fieldset>
								<legend className="mt-3">
									Allowed Email Domains
								</legend>
								<FormTokenField
									id="domains"
									label="Add domain name"
									value={domains}
									onChange={(tokens) => setDomains(tokens)}
									placeholder="domain.com, mywebsite.org, example.ca.gov"
								/>
							</fieldset>
						</div>
						<div className="col-lg-8">
							<TabPanel tabs={tabs}>
								{(tab) => (
									<Card className="mb-3">
										{tab.name === 'options' && (
											<>
												<CardHeader>
													{tab.title}
												</CardHeader>
												<CardBody>
													<fieldset>
														<legend>
															Checkout Options
														</legend>
														<CheckboxControl
															label="Price Availability"
															checked={
																role.price_availability
															}
															onChange={(value) =>
																setRole({
																	...role,
																	price_availability:
																		value,
																})
															}
														/>
														<CheckboxControl
															label="Credit Line"
															checked={
																role.credit_line
															}
															onChange={(value) =>
																setRole({
																	...role,
																	credit_line:
																		value,
																})
															}
														/>
														<CheckboxControl
															label="Allow Payment"
															checked={
																role.allow_payment
															}
															onChange={(value) =>
																setRole({
																	...role,
																	allow_payment:
																		value,
																})
															}
														/>
														<CheckboxControl
															label="Taxable"
															checked={
																role.taxable
															}
															onChange={(value) =>
																setRole({
																	...role,
																	taxable:
																		value,
																})
															}
														/>
													</fieldset>
													<fieldset>
														<legend>
															Billing and Shipping
															Options
														</legend>
														<BaseControl
															id="locked-addresses"
															help="Locking address fields will force any customer assigned to this role to select a previously saved address during checkout."
														>
															<CheckboxControl
																label="Lock Billing Address fields"
																checked={
																	role.lock_billing
																}
																onChange={(
																	value
																) =>
																	setRole({
																		...role,
																		lock_billing:
																			value,
																	})
																}
															/>
															<CheckboxControl
																label="Lock Shipping Address fields"
																checked={
																	role.lock_shipping
																}
																onChange={(
																	value
																) =>
																	setRole({
																		...role,
																		lock_shipping:
																			value,
																	})
																}
															/>
														</BaseControl>
													</fieldset>
													<fieldset>
														<legend>
															Punchout Options
														</legend>
														<CheckboxControl
															label="Enable Punchout"
															checked={
																role.punchout_only
															}
															onChange={(value) =>
																setRole({
																	...role,
																	punchout_only:
																		value,
																})
															}
														/>
														{role.punchout_only && (
															<CheckboxControl
																label="Mixed Punchout"
																checked={
																	role.mixed_punchout
																}
																onChange={(
																	value
																) =>
																	setRole({
																		...role,
																		mixed_punchout:
																			value,
																	})
																}
															/>
														)}
													</fieldset>
												</CardBody>
											</>
										)}
										{tab.name === 'documents' && (
											<>
												<CardHeader>
													{tab.title}
													<Button
														variant="secondary"
														onClick={addDocument}
													>
														Add New Document
													</Button>
												</CardHeader>
												<CardBody>
													{role.documents &&
														role.documents.map(
															(
																document,
																index
															) => (
																<Card
																	key={index}
																	size="small"
																>
																	<CardBody>
																		<div className="row">
																			<div className="col">
																				<TextControl
																					label="Document Name"
																					value={
																						document.name
																					}
																					onChange={(
																						value
																					) =>
																						setDocument(
																							{
																								...document,
																								name: value,
																							},
																							index
																						)
																					}
																				/>
																				<ToggleControl
																					label="Required"
																					checked={
																						document.required
																					}
																					onChange={(
																						value
																					) =>
																						setDocument(
																							{
																								...document,
																								required:
																									value,
																							},
																							index
																						)
																					}
																				/>
																			</div>
																			<div className="col-auto">
																				<Button
																					label="Delete Document"
																					isDestructive
																					icon="trash"
																					onClick={() =>
																						deleteDocument(
																							index
																						)
																					}
																				></Button>
																			</div>
																		</div>
																	</CardBody>
																</Card>
															)
														)}
													{(!role.documents ||
														!role.documents
															.length) && (
														<p>
															No documents found.
														</p>
													)}
												</CardBody>
											</>
										)}
									</Card>
								)}
							</TabPanel>
						</div>
					</div>
					<Flex justify={'start'}>
						<Button isBusy={isBusy} variant="primary" type="submit">
							{isNew ? 'Save' : 'Update'}
						</Button>
						{role.id && (
							<Button
								isBusy={isBusy}
								isDestructive
								onClick={openModal}
							>
								Delete
							</Button>
						)}
					</Flex>
				</fieldset>
			</form>
			{isOpen && (
				<Modal title="Delete this role?" onRequestClose={closeModal}>
					<p>This will delete this role.</p>
					<div className="hstack gap-1 justify-content-end">
						<button
							className="btn btn-outline-primary"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button className="btn btn-danger" onClick={deleteRole}>
							Delete
						</button>
					</div>
				</Modal>
			)}
		</>
	);
};
