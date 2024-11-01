import {
	Button,
	Card,
	CardBody,
	Flex,
	Modal,
	TextareaControl,
} from '@wordpress/components';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { vfAPI } from '../../../lib/vfAPI';
import type { Localized } from '../../../types';
import { Spinner } from '../../../../../resources/js/Shared/Spinner';

declare const localized: Localized;

interface Config {
	params: {
		group_id: number;
		note_id?: number | null;
	};
}

export const GroupNotes = (props) => {
	const config: Config = {
		params: {
			group_id: props.groupId,
		},
	};
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	const [hasResolved, setResolved] = useState(false);
	const [id, setId] = useState<number | null>();
	const [isBusy, setBusy] = useState(false);
	const [isOpen, setOpen] = useState(false);
	const [notes, setNotes] = useState([]);
	const [note, setNote] = useState<string>('');

	const closeModal = () => setOpen(false);

	const destroyNote = () => {
		setBusy(true);
		config.params.note_id = id;
		const url = `${nextApiURL}/admin/group/note/${id}`;

		vfAPI
			.delete(url, config)
			.then((response) => {
				if (!response.data.errors.length) {
					setId(null);
					setBusy(false);
					indexNotes();
				}
			})
			.finally(() => {
				closeModal();
			});
	};

	const indexNotes = () => {
		setBusy(true);
		const url = `${nextApiURL}/admin/group/note`;

		vfAPI.get(url, config).then((response) => {
			if (!response.data.errors.length) {
				setNotes(response.data.notes);
				setResolved(true);
				setBusy(false);
			}
		});
	};

	const handleDelete = (id: number) => {
		setId(id);
		setOpen(true);
	};

	const storeNote = () => {
		setBusy(true);
		const url = `${nextApiURL}/admin/group/note`;
		const data = { note };
		vfAPI.post(url, data, config).then((response) => {
			if (!response.data.errors.length) {
				setNote('');
				indexNotes();
			}
		});
	};

	useEffect(() => {
		if (props.groupId) {
			indexNotes();
		}
	}, [props.groupId]);

	return (
		<>
			<Card>
				<CardBody>
					<TextareaControl
						value={note}
						label="Add new note"
						onChange={setNote}
					/>
					<Flex justify="end">
						<Button
							variant="primary"
							onClick={storeNote}
							disabled={!note.length}
						>
							Save
						</Button>
					</Flex>
				</CardBody>
			</Card>

			{hasResolved ? (
				<>
					<caption>Notes</caption>
					<Flex direction="column">
						{notes.map(
							(item: {
								note: string;
								datetime: string;
								note_id: number;
							}) => (
								<Card key={item.note_id}>
									<CardBody>
										<div>{item.note}</div>
										<Flex
											justify="space-between"
											align="baseline"
										>
											<small>
												{new Date(
													item.datetime
												).toLocaleString()}
											</small>
											<Button
												isSmall
												isDestructive
												onClick={() => {
													handleDelete(item.note_id);
												}}
											>
												Delete
											</Button>
										</Flex>
									</CardBody>
								</Card>
							)
						)}
					</Flex>
				</>
			) : (
				<Spinner />
			)}

			{isOpen && (
				<Modal title="Delete note" onRequestClose={closeModal}>
					Delete this note?
					<Flex justify="end">
						<button
							className="btn btn-secondary"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							className="btn btn-danger"
							onClick={destroyNote}
						>
							Delete
						</button>
					</Flex>
				</Modal>
			)}
		</>
	);
};

GroupNotes.propTypes = {
	groupId: PropTypes.number.isRequired, // Group ID
};
