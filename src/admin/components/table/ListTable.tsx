import React, { useEffect, useState } from 'react';
import { Button, Icon, Modal } from '@wordpress/components';
import type { Header } from './Header';

interface Props {
	addItem?: (id: number) => void;
	canDelete?: boolean;
	canEdit?: boolean;
	caption?: string;
	deleteItem?: (id: number) => void;
	editItem?: (id: number) => void;
	removeItem?: (id: number) => void;
	isBusy: boolean;
	headers: Header[];
	rows: unknown[];
	setSortBy: any;
	setSortType: any;
	sortBy: string;
	sortType: 'asc' | 'desc';
	viewItem?: (id: number) => void;
}

const getBadgeColor = (context: { string: string }, value: string): string => {
	return context[value] ? context[value] : 'secondary';
};

export const ListTable = ({
	addItem,
	caption,
	deleteItem,
	editItem,
	isBusy,
	headers,
	removeItem,
	rows,
	sortBy,
	setSortBy,
	setSortType,
	sortType,
	viewItem,
}: Props) => {
	const [isConfirming, setIsConfirming] = useState<number | null>();
	const [canAdd, setCanAdd] = useState(false);
	const [canDelete, setCanDelete] = useState(false);
	const [canEdit, setCanEdit] = useState(false);
	const [canRemove, setCanRemove] = useState(false);
	const [canView, setCanView] = useState(false);

	const cancelDelete = () => {
		setIsConfirming(null);
	};

	const confirmDelete = (id: number) => {
		setIsConfirming(null);
		deleteItem(id);
	};

	const clickSortBy = (key: string): void => {
		if (sortBy === key) {
			const updatedSortType = sortType === 'desc' ? 'asc' : 'desc';
			setSortType(updatedSortType);
		}
		setSortBy(key);
	};

	const handleClick = (e: Event, id: number) => {
		e.preventDefault();
		if (canEdit) {
			editItem(id);
		} else {
			viewItem(id);
		}
	};

	const showConfirmDialog = (id: number) => {
		setIsConfirming(id);
	};

	useEffect(() => {
		if (addItem) {
			setCanAdd(true);
		}
		if (deleteItem) {
			setCanDelete(true);
		}
		if (editItem) {
			setCanEdit(true);
		}
		if (removeItem) {
			setCanRemove(true);
		}
		if (viewItem) {
			setCanView(true);
		}
	}, []);

	return (
		<table className="table table-striped caption-top">
			{caption && <caption>{caption}</caption>}
			<thead>
				<tr>
					{headers.map((header: Header) => (
						<th
							className={`${
								sortBy === header.key ? 'sorted' : 'sortable'
							} ${setSortBy ? sortType : 'p-2'}`}
							key={header.key}
						>
							{setSortBy && (
								<button
									type="button"
									onClick={() => clickSortBy(header.key)}
									title={`Sort by ${header.label}`}
								>
									<span>{header.label}</span>
									<span className="sorting-indicator"></span>
								</button>
							)}
							{!setSortBy && <span>{header.label}</span>}
						</th>
					))}
					{(canAdd ||
						canDelete ||
						canEdit ||
						canRemove ||
						canView) && <th className="text-end">Actions</th>}
				</tr>
			</thead>
			<tbody>
				{!rows.length && (
					<tr>
						<td
							colSpan={
								headers.length +
								(canAdd ||
								canDelete ||
								canEdit ||
								canRemove ||
								canView
									? 1
									: 0)
							}
						>
							No items found.
						</td>
					</tr>
				)}
				{rows.map((row: any, index: number) => (
					<tr key={index}>
						{headers.map((header: Header, i: number) => (
							<td className="placeholder-glow" key={header.key}>
								<span
									className={
										isBusy
											? 'placeholder placeholder-sm align-baseline'
											: ''
									}
								>
									{i === 1 && (
										<strong>
											{canEdit || canView ? (
												<a
													href="#"
													title={`${
														canEdit
															? 'Edit'
															: 'View'
													} ${row[header.key]}`}
													onClick={(e) => {
														handleClick(e, row.id);
													}}
												>
													{row[header.key]}
												</a>
											) : (
												<span className="row-title">
													{row[header.key]}
												</span>
											)}
										</strong>
									)}
									{i !== 1 && (
										<>
											{header.type === 'array' &&
												row[header.key] &&
												row[header.key].map(
													(
														item: string,
														i: number
													) => (
														<span
															key={i}
															className="badge text-dark bg-light"
														>
															{item}
														</span>
													)
												)}
											{header.type === 'badge' && (
												<span
													className={`badge text-capitalize bg-${getBadgeColor(
														header.context,
														row[header.key]
													)}`}
												>
													{row[header.key]}
												</span>
											)}
											{header.type === 'boolean' &&
												row[header.key] && (
													<Icon icon="yes" />
												)}
											{header.type === 'date' &&
												new Date(
													row[header.key]
												).toLocaleDateString()}
											{header.type !== 'array' &&
												header.type !== 'badge' &&
												header.type !== 'boolean' &&
												header.type !== 'date' &&
												row[header.key]}
										</>
									)}
								</span>
							</td>
						))}
						{(canAdd ||
							canDelete ||
							canEdit ||
							canRemove ||
							canView) && (
							<td className="text-end">
								{canAdd && (
									<Button
										isSmall={true}
										icon="insert"
										label="Add item"
										onClick={() => addItem(row.id)}
									/>
								)}
								{(canEdit || canView) && (
									<Button
										isSmall={true}
										icon={canEdit ? 'edit' : 'visibility'}
										label={canEdit ? 'Edit' : 'View'}
										onClick={() => {
											if (canEdit) {
												editItem(row.id);
											} else {
												viewItem(row.id);
											}
										}}
									/>
								)}
								{canDelete && (
									<Button
										isSmall={true}
										icon="trash"
										label="Delete"
										onClick={() =>
											showConfirmDialog(row.id)
										}
									/>
								)}
								{canRemove && (
									<Button
										isSmall={true}
										icon="remove"
										label="Remove attached item"
										onClick={() => removeItem(row.id)}
									/>
								)}
								{isConfirming === row.id && (
									<Modal
										title="Delete this item?"
										onRequestClose={cancelDelete}
									>
										<p>This will delete this item.</p>
										<div className="hstack gap-1 justify-content-end">
											<Button
												variant="secondary"
												onClick={cancelDelete}
											>
												Cancel
											</Button>
											<Button
												variant="primary"
												isDestructive
												onClick={() =>
													confirmDelete(row.id)
												}
											>
												Delete
											</Button>
										</div>
									</Modal>
								)}
							</td>
						)}
					</tr>
				))}
			</tbody>
		</table>
	);
};
