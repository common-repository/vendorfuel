import { useEffect, useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import { Button, Modal, Flex, CheckboxControl } from '@wordpress/components';
import type { Localized, Paginator } from '../../../types';
import { SearchControl } from '../SearchControl';
import { TablePagination } from '../../table/TablePagination';
import { vfAPI } from '../../../shared/vfAPI';
import { TableData } from '../../table/TableData';
import { Spinner } from '../../spinner/Spinner';

declare const localized: Localized;

/**
 * Modal for searching models and returning an array of selected model IDs.
 *
 * @param props
 */
export const SearchModal = (props) => {
	const sectionsStyle = {
		height: 'calc(90vh - 215px )',
		overflow: 'auto',
		padding: '1px',
		marginBottom: '8px',
	};
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	const underscoresToSpaces = (input: string): string => {
		const regex = /_/g;
		return input.replace(regex, ' ');
	};

	const [idsToAdd, setIdsToAdd] = useState(new Set());
	const [index, setIndex] = useState<Paginator>();
	const [isBusy, setBusy] = useState(false);
	const [isOpen, setOpen] = useState(false);
	const [page, setPage] = useState<number>(1);
	const [q, setQ] = useState<string>('');

	const closeModal = () => {
		// Reset state after modal is closed.
		setOpen(false);
		setIdsToAdd(new Set());
		setPage(1);
		setQ('');
	};

	const handleAdd = () => {
		const ids = Array.from(idsToAdd).map((id) => {
			return { id };
		});
		props.handleAdd(ids);
		closeModal();
	};

	const handleCheck = (item) => {
		const ids = new Set(idsToAdd);

		if (ids.has(item.id)) {
			ids.delete(item.id);
		} else {
			ids.add(item.id);
		}
		setIdsToAdd(ids);
	};

	const indexModels = () => {
		setBusy(true);
		const url = `${nextApiURL}/admin/${props.path}`;
		const config = {
			params: {
				excludedField: props.excludedField,
				excludedId: props.excludedId,
				excludedTable: props.excludedTable,
				perPage: 15,
				page,
				q,
			},
		};
		vfAPI.get(url, config).then((response) => {
			if (!response.data.errors.length) {
				setIndex(response.data[props.model]);
				setBusy(false);
			}
		});
	};

	const isModelChecked = (item) => {
		return idsToAdd.has(item.id);
	};

	const openModal = () => {
		indexModels();
		setOpen(true);
	};

	/**
	 * Only index the models when the modal is open.
	 */
	useEffect(() => {
		if (isOpen) {
			indexModels();
		}
	}, [page]);

	return (
		<>
			<button className="btn btn-outline-primary" onClick={openModal}>
				Add {underscoresToSpaces(props.model)}
			</button>
			{isOpen && (
				<Modal
					title={`Add ${underscoresToSpaces(props.model)}`}
					onRequestClose={closeModal}
					isFullScreen
				>
					<Flex align="center" gap={3}>
						<SearchControl
							value={q}
							onChange={setQ}
							handleSubmit={indexModels}
							isBusy={isBusy}
						/>
						{index && (
							<TablePagination
								isBusy={isBusy}
								handleChange={setPage}
								paginator={index}
							/>
						)}
					</Flex>
					{!index ? (
						<Spinner />
					) : (
						<section style={sectionsStyle}>
							<table
								className={`table ${isBusy ? 'is-busy' : ''}`}
							>
								<thead>
									<tr>
										<td
											id="cb"
											className="manage-column column-cb check-column"
										></td>
										{props.headers.map((header) => (
											<th>{header.label}</th>
										))}
									</tr>
								</thead>
								<tbody>
									{index?.data?.length === 0 && (
										<tr>
											<td
												colSpan={
													props.headers.length + 1
												}
											>
												No results found.
											</td>
										</tr>
									)}
									{index?.data?.map((item) => (
										<tr>
											<th scope="row">
												<CheckboxControl
													checked={isModelChecked(
														item
													)}
													onChange={() => {
														handleCheck(item);
													}}
												/>
											</th>
											{props.headers.map((header) => (
												<>
													<TableData
														value={
															item[header.value]
														}
														type={header.type}
													/>
												</>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</section>
					)}
					<Flex
						justify="end"
						style={{
							position: 'absolute',
							bottom: '2rem',
							right: '2rem',
						}}
					>
						<button
							className="btn btn-outline-primary"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button className="btn btn-primary" onClick={handleAdd}>
							Add {underscoresToSpaces(props.model)}
						</button>
					</Flex>
				</Modal>
			)}
		</>
	);
};

SearchModal.propTypes = {
	handleAdd: PropTypes.func, // Callback for when the user selects the 'Add' button to complete the selection.
	headers: PropTypes.array, // Array of headers to be used when modal displays the table of models.
	model: PropTypes.string, // Name of the model that is returned from the API. Is usually a plural string. Used also for excludeTable value.
	path: PropTypes.string, // API path following admin for getting the models.
	excludedField: PropTypes.string, // Key to use for excluding models that have already been added.
	excludedId: PropTypes.number, // ID for excluding models that have already been added. For example, to exclude models already added to a group, the excludedField should be 'group_id' and the excludedId equal to the group ID.
	excludedTable: PropTypes.string, // Table name for excluding models that have already been added.
};
