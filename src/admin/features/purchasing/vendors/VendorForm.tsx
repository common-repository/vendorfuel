import { Button, Flex, Modal, TextControl } from '@wordpress/components';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { vfAPI } from '../../../lib/vfAPI';
import { Vendor } from '../../../../../app/models/Vendor';
import { apiURL } from '../../../data/apiURL';
import { Spinner } from '../../../../../resources/js/Shared/Spinner';

export const VendorForm = (props) => {
	const baseURL = apiURL.VENDORS;

	const [hasResolved, setResolved] = useState<boolean>(false);
	const [isOpen, setOpen] = useState<boolean>(false);
	const [vendor, setVendor] = useState<Vendor>(new Vendor());

	const closeModal = () => setOpen(false);

	const destroyVendor = () => {
		const url = `${baseURL}/${vendor.id}`;
		vfAPI.delete(url).then((response) => {
			location.assign(location.href.replace(`/${vendor.id}`, ''));
		});
	};

	const handleChange = (change) => {
		setVendor((prev) => {
			return {
				...prev,
				...change,
			};
		});
	};

	const handleDelete = () => {
		setOpen(true);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (props.isNew) {
			storeVendor();
		} else {
			updateVendor();
		}
	};

	const showVendor = (id: number) => {
		const url = `${baseURL}/${id}`;
		vfAPI.get(url).then((response) => {
			if (response.data.vendor) {
				setVendor(response.data.vendor);
			}
		});
	};

	const storeVendor = () => {
		const url = `${baseURL}`;
		vfAPI.post(url, vendor).then((response) => {
			if (response.data.vendor) {
				location.assign(
					location.href.replace(
						'create',
						response.data.vendor.id.toString()
					)
				);
			}
		});
	};

	const updateVendor = () => {
		const url = `${baseURL}/${vendor.id}`;
		vfAPI.put(url, vendor).then(() => {});
	};

	useEffect(() => {
		if (props.id) {
			showVendor(props.id);
		}
	}, [props.id]);

	useEffect(() => {
		if (props.isNew) {
			setVendor(new Vendor());
			props.setBreadcrumbs((prev) => [
				...prev,
				{
					name: 'Add new',
					href: '?page=vendorfuel#!/purchasing/vendors/create',
				},
			]);
		}
	}, [props.isNew]);

	useEffect(() => {
		setResolved(true);
		if (vendor.id) {
			props.setBreadcrumbs((prev) => {
				const breadcrumbs = [...prev];
				breadcrumbs.push({
					label: vendor.name,
					href: `?page=vendorfuel#!/purchasing/vendors/${vendor.id}`,
				});
				return breadcrumbs;
			});
		}
	}, [vendor]);

	return (
		<>
			{hasResolved ? (
				<div className="row">
					<div className="col-lg-4">
						<form onSubmit={handleSubmit}>
							<fieldset>
								<TextControl
									label="Name"
									value={vendor.name}
									onChange={(name) => {
										handleChange({ name });
									}}
								/>
								<TextControl
									label="Lead time"
									value={vendor.lead_time}
									onChange={(lead_time) => {
										handleChange({ lead_time });
									}}
								/>
								<TextControl
									label="Location"
									value={vendor.location}
									onChange={(location) => {
										handleChange({ location });
									}}
								/>
							</fieldset>
							<Flex justify="start">
								<Button variant="primary" type="submit">
									{props.isNew ? 'Save' : 'Update'}
								</Button>
								<Button
									isDestructive
									type="button"
									onClick={handleDelete}
								>
									Delete
								</Button>
							</Flex>
						</form>
					</div>
					<div className="col-lg-8"></div>
				</div>
			) : (
				<Spinner />
			)}
			{isOpen && (
				<Modal title="Delete this vendor" onRequestClose={closeModal}>
					<p>This will delete this vendor.</p>
					<Flex justify="end">
						<button
							className="btn btn-secondary"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							className="btn btn-danger"
							onClick={destroyVendor}
						>
							Delete
						</button>
					</Flex>
				</Modal>
			)}
		</>
	);
};

VendorForm.propTypes = {
	id: PropTypes.number,
	isNew: PropTypes.bool,
	setBreadcrumbs: PropTypes.func,
};
