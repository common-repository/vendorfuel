import { useEffect, useState } from '@wordpress/element';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Flex,
	Modal,
	RadioControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { vfAPI } from '../../../shared/vfAPI';
import { stateOptions } from '../../../data/stateOptions';
import { PasswordControl } from '../../../components/form/PasswordControl';
import { Breadcrumb } from '../../../shared/Breadcrumb';

interface IProps {
	profileId: number;
	isNew: boolean;
}

interface IProfile {
	phone?: string | number;
	zip?: string;
	state?: string | null;
	city?: string;
	address1?: string;
	address2?: string;
	address3?: string;
	receiver_id_type?: string;
	receiver_id?: string | number;
	account_user?: string;
	account_password?: string;
	endpoint?: string;
	format?: 'cxml' | 'pdf' | 'csv' | null;
	id?: number;
	name?: string;
	email?: string;
}

const apiUrl = '/purchasing/document-profile/';
const formatOptions = [
	{ label: 'cXML', value: 'cxml' },
	{ label: 'PDF', value: 'pdf' },
	{ label: 'CSV', value: 'csv' },
];
const receiverOptions = [
	{ label: 'Network ID', value: 'NetworkID' },
	{ label: 'DUNS', value: 'DUNS' },
];

export const DocumentProfile = ({ isNew, profileId }: IProps) => {
	const [breadcrumbs, setBreadcrumbs] = useState([
		{ label: 'Purchasing', href: '?page=vf-purchasing' },
		{
			label: 'Document Profiles',
			href: '?page=vf-purchasing#/document-profiles',
		},
	]);
	const [isBusy, setIsBusy] = useState<boolean>(true);
	const [isOpen, setOpen] = useState(false);
	const [profile, setProfile] = useState<IProfile>({});

	useEffect(() => {
		if (profileId) {
			getProfile(profileId);
		}
	}, [profileId]);

	useEffect(() => {
		if (isNew) {
			setBreadcrumbs([
				...breadcrumbs,
				{
					label: 'Add New',
					href: '?page=vendorfuel#!/purchasing/document-profiles/create',
				},
			]);
			setIsBusy(false);
		}
	}, [isNew]);

	useEffect(() => {
		if (isNew && profile.id) {
			location.assign(
				location.href.replace('create', profile.id.toString())
			);
		}
	}, [profile]);

	const closeModal = () => setOpen(false);

	const deleteProfile = () => {
		setIsBusy(true);
		vfAPI.delete(`${apiUrl}${profile.id}`).then((response) => {
			if (!response.data.errors.length) {
				location.assign(
					location.href.replace(`/${profile.id.toString()}`, '')
				);
			}
		});
	};

	const getProfile = (id: number) => {
		setIsBusy(true);
		vfAPI.get(`${apiUrl}${id}`).then((response) => {
			if (!response.data.errors.length) {
				setBreadcrumbs([
					...breadcrumbs,
					{
						label: response.data.document_profile.name,
						href: `?page=vendorfuel#!/purchasing/document-profiles/${profileId}`,
					},
				]);
				setProfile(response.data.document_profile);
			}
			setIsBusy(false);
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isNew) {
			save();
		} else {
			update();
		}
	};

	const openModal = () => setOpen(true);

	const save = () => {
		setIsBusy(true);
		vfAPI.post(apiUrl, profile).then((response) => {
			if (!response.data.errors.length) {
				setProfile(response.data.document_profile);
			}
			setIsBusy(false);
		});
	};

	const update = () => {
		setIsBusy(true);
		vfAPI.put(`${apiUrl}${profile.id}`, profile).then((response) => {
			if (!response.data.errors.length) {
				setProfile(response.data.document_profile);
			}
			setIsBusy(false);
		});
	};
	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<h2>{isNew ? 'Add New' : 'Edit'} document profile</h2>
			<form onSubmit={handleSubmit}>
				<fieldset disabled={isBusy}>
					<div className="row">
						<div className="col-lg-4">
							<TextControl
								label="Name (required)"
								value={profile.name}
								onChange={(value) =>
									setProfile({ ...profile, name: value })
								}
								required
							/>
							<SelectControl
								label="Format (required)"
								value={profile.format}
								onChange={(value) =>
									setProfile({ ...profile, format: value })
								}
								options={[
									{ label: '', value: null },
									...formatOptions,
								]}
								required
							/>
							<TextControl
								label="Endpoint"
								type="url"
								value={profile.endpoint}
								onChange={(value) =>
									setProfile({ ...profile, endpoint: value })
								}
							/>
							<TextControl
								label="Account User"
								value={profile.account_user}
								onChange={(value) =>
									setProfile({
										...profile,
										account_user: value,
									})
								}
							/>
							<PasswordControl
								label="Account Password"
								value={profile.account_password}
								onChange={(value) =>
									setProfile({
										...profile,
										account_password: value,
									})
								}
							/>
							<TextControl
								label="Receiver ID"
								value={profile.receiver_id}
								onChange={(value) =>
									setProfile({
										...profile,
										receiver_id: value,
									})
								}
							/>
							<RadioControl
								label="Receiver ID Type"
								selected={profile.receiver_id_type}
								onChange={(value) =>
									setProfile({
										...profile,
										receiver_id_type: value,
									})
								}
								options={receiverOptions}
							/>
						</div>
						<div className="col-lg-8">
							<fieldset>
								<Card>
									<CardHeader>Account Receivable</CardHeader>
									<CardBody>
										<div className="row">
											<div className="col-sm">
												<TextControl
													label="Email (required)"
													type="email"
													value={profile.email}
													onChange={(value) =>
														setProfile({
															...profile,
															email: value,
														})
													}
													required
												/>
											</div>
											<div className="col-sm">
												<TextControl
													label="Phone"
													value={profile.phone}
													onChange={(value) =>
														setProfile({
															...profile,
															phone: value,
														})
													}
												/>
											</div>
										</div>
										<TextControl
											label="Street Address"
											value={profile.address1}
											onChange={(value) =>
												setProfile({
													...profile,
													address1: value,
												})
											}
										/>
										<TextControl
											label="Apt., Suite, etc."
											value={profile.address2}
											onChange={(value) =>
												setProfile({
													...profile,
													address2: value,
												})
											}
										/>
										<TextControl
											label="Additional Address"
											value={profile.address3}
											onChange={(value) =>
												setProfile({
													...profile,
													address3: value,
												})
											}
										/>
										<div className="row align-items-baseline">
											<div className="col-sm">
												<TextControl
													label="City"
													value={profile.city}
													onChange={(value) =>
														setProfile({
															...profile,
															city: value,
														})
													}
												/>
											</div>
											<div className="col-sm">
												<SelectControl
													label="State"
													value={profile.state}
													onChange={(value) =>
														setProfile({
															...profile,
															state: value,
														})
													}
													options={[
														{
															label: '',
															value: null,
														},
														...stateOptions,
													]}
												/>
											</div>
											<div className="col-sm">
												<TextControl
													label="Zip Code"
													value={profile.zip}
													onChange={(value) =>
														setProfile({
															...profile,
															zip: value,
														})
													}
												/>
											</div>
										</div>
									</CardBody>
								</Card>
							</fieldset>
						</div>
					</div>
				</fieldset>
				<Flex justify={'start'}>
					<Button isBusy={isBusy} variant="primary" type="submit">
						{isNew ? 'Save' : 'Update'}
					</Button>
					{profile.id && (
						<Button
							isBusy={isBusy}
							isDestructive
							onClick={openModal}
						>
							Delete
						</Button>
					)}
				</Flex>
			</form>
			{isOpen && (
				<Modal
					title="Delete this document profile?"
					onRequestClose={closeModal}
				>
					<p>This will delete this document profile.</p>
					<div className="hstack gap-1 justify-content-end">
						<button
							className="btn btn-outline-primary"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							className="btn btn-danger"
							onClick={deleteProfile}
						>
							Delete
						</button>
					</div>
				</Modal>
			)}
		</>
	);
};
