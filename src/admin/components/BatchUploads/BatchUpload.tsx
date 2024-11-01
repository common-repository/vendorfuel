import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { vfAPI } from '../../lib/vfAPI';
import type { Batch, BatchFailure } from '../../types';
import { Button, Flex, Modal } from '@wordpress/components';
import { Breadcrumb } from '../../../../resources/js/Shared/Breadcrumb';
import { Spinner } from '../../../../resources/js/Shared/Spinner';

export const BatchUpload = (props) => {
	const [batch, setBatch] = useState<Batch>();
	const [breadcrumbs, setBreadcrumbs] = useState(props.breadcrumbs);
	const [failureDetails, setFailureDetails] = useState<BatchFailure>();
	const [id, setId] = useState<number>();
	const [isBusy, setBusy] = useState<boolean>(false);
	const [isOpen, setOpen] = useState(false);

	const checkId = () => {
		const lastHash = location.hash.split('/').pop();
		if (lastHash !== 'new') {
			setId(Number(lastHash));
		}
	};

	const closeModal = () => setOpen(false);

	const handleClick = () => {
		show();
	};

	const show = () => {
		setBusy(true);
		const url = `${props.url}/batches/${id}`;
		vfAPI.get(url).then((response) => {
			if (response.data.batch) {
				setBatch(response.data.batch);
			}
			setBusy(false);
		});
	};

	const handleDetails = (failure: BatchFailure) => {
		setFailureDetails(failure);
		openModal();
	};

	const openModal = () => setOpen(true);

	useEffect(() => {
		checkId();
	}, []);

	useEffect(() => {
		if (id) {
			setBreadcrumbs([
				...props.breadcrumbs,
				{
					label: id.toString(),
					href: `${props.linkToUploads}/${id}`,
				},
			]);
			show();
		}
	}, [id]);

	useEffect(() => {
		if (batch) {
			setBreadcrumbs([
				...props.breadcrumbs,
				{
					label: batch.filename,
					href: `${props.linkToUploads}/${id}`,
				},
			]);
		}
	}, [batch]);

	return (
		<>
			<Breadcrumb breadcrumbs={breadcrumbs} />
			<Flex justify={'start'}>
				<h2>View upload</h2>
				{(batch?.status === 'uploaded' ||
					batch?.status === 'processing') && (
					<button
						className="btn btn-secondary btn-sm"
						onClick={handleClick}
					>
						Refresh
					</button>
				)}
			</Flex>
			{id && (
				<>
					{isBusy && !batch && <Spinner />}
					{batch && (
						<>
							<table className="table table-striped mb-3">
								<thead>
									<tr>
										<th>ID</th>
										<th>Filename</th>
										<th>Uploaded</th>
										<th>Completed</th>
										<th>Status</th>
										<th>Total records</th>
										<th>Processed records</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{batch.id}</td>
										<td className="column-title">
											<strong>{batch.filename}</strong>
										</td>
										<td>
											{new Date(
												batch.uploaded_at
											).toLocaleString()}
										</td>
										<td>
											{batch.finished_at ? (
												new Date(
													batch.finished_at
												).toLocaleString()
											) : (
												<>&mdash;</>
											)}
										</td>
										<td
											style={{
												textTransform: 'capitalize',
											}}
										>
											{batch.status}
										</td>
										<td>
											{batch.total_records.toLocaleString()}
										</td>
										<td>
											{batch.processed_records?.toLocaleString()}
										</td>
									</tr>
								</tbody>
							</table>
							{batch.failures?.data.length > 0 && (
								<table className="table table-striped caption-top mb-3">
									<caption>Failures</caption>
									<thead>
										<tr>
											<th>Row</th>
											<th>Failures</th>
											<th>Details</th>
										</tr>
									</thead>
									<tbody>
										{batch.failures.data.map((failure) => (
											<tr key={failure.row}>
												<th scope="row">
													{failure.row}
												</th>
												<td>
													{failure.failures.map(
														(msg: string) => (
															<>{msg}</>
														)
													)}
												</td>
												<td>
													<Button
														isSmall
														variant="primary"
														onClick={() => {
															handleDetails(
																failure
															);
														}}
													>
														View
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
							{isOpen && (
								<Modal
									title="Failure details"
									onRequestClose={closeModal}
								>
									{failureDetails && (
										<table className="table table-striped">
											<tbody>
												<tr>
													<th scope="row">
														Customer batch ID
													</th>
													<td>
														{
															failureDetails.customer_batch_id
														}
													</td>
												</tr>
												<tr>
													<th scope="row">
														Failures
													</th>
													<td>
														{failureDetails.failures.join()}
													</td>
												</tr>
												<tr>
													<th scope="row">ID</th>
													<td>{failureDetails.id}</td>
												</tr>
												<tr>
													<th scope="row">Row</th>
													<td>
														{failureDetails.row}
													</td>
												</tr>
												<tr>
													<th scope="row">Value</th>
													<td>
														<table className="table table-striped">
															<tbody>
																{Object.entries(
																	failureDetails.value
																).map(
																	(
																		item,
																		i
																	) => (
																		<>
																			{item[0] && (
																				<tr
																					key={
																						i
																					}
																				>
																					<th scope="row">
																						{
																							item[0]
																						}
																					</th>
																					<td>
																						{
																							item[1]
																						}
																					</td>
																				</tr>
																			)}
																		</>
																	)
																)}
															</tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									)}
								</Modal>
							)}
						</>
					)}
					{!isBusy && !batch && (
						<Button variant="primary" href={props.linkToUploads}>
							Go back to uploads
						</Button>
					)}
				</>
			)}
		</>
	);
};

BatchUpload.propTypes = {
	breadcrumbs: PropTypes.array.isRequired,
	linkToUploads: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
};
