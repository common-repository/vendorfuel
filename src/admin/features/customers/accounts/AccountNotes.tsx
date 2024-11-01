import { useEffect, useState } from '@wordpress/element';
import { Button, Flex, Modal, TextareaControl } from '@wordpress/components';
import PropTypes from 'prop-types';
import { Table } from '../../../components/table/Table';
import { apiURL } from '../../../data/apiURL';
import { vfAPI } from '../../../shared/vfAPI';
import { DeleteButton } from '../../../components/DeleteButton';

interface Notes {
	data: {
		id: number;
		content: string;
		created_at: string;
		admin: {
			id: number;
			email: string;
			name: string;
		};
	}[];
	from: number;
	last_page: number;
	to: number;
	total: number;
}

export const AccountNotes = (props) => {
	const { customerId } = props;
	const DEFAULT_PER_PAGE = 30;
	const MAX_PER_PAGE = 500;

	const [content, setContent] = useState<string>('');
	const [perPage, setPerPage] = useState<number>(DEFAULT_PER_PAGE);
	const [isBusy, setBusy] = useState<boolean>();
	const [notes, setNotes] = useState<Notes>();

	const destroy = (id: number) => {
		setBusy(true);
		const url = `${apiURL.CUSTOMERS}/${customerId}/notes/${id}`;
		vfAPI.delete(url).then((response) => {
			if (!response.data.errors.length) {
				index();
				setBusy(false);
			}
		});
	};

	const handleDelete = (id: number) => {
		destroy(id);
	};

	const handleMore = () => {
		setPerPage(MAX_PER_PAGE);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		store();
	};

	const index = () => {
		setBusy(true);
		const url = `${apiURL.CUSTOMERS}/${customerId}/notes`;
		const config = {
			params: {
				perPage,
			},
		};
		vfAPI.get(url, config).then((response) => {
			if (!response.data.errors.length) {
				setNotes(response.data.notes);
				setBusy(false);
			}
		});
	};

	const store = () => {
		setBusy(true);
		const url = `${apiURL.CUSTOMERS}/${customerId}/notes`;
		const data = { content };
		vfAPI
			.post(url, data)
			.then((response) => {
				if (!response.data.errors.length) {
					index();
					setContent('');
				}
			})
			.finally(() => {
				setBusy(false);
			});
	};

	useEffect(() => {
		// Set the initial notes passed down from parent component.
		if (props.notes) {
			setNotes(props.notes);
		}
	}, [props.notes]);

	useEffect(() => {
		// Only reindex if the Load more button triggers setting perPage.
		if (perPage === MAX_PER_PAGE) {
			index();
		}
	}, [perPage]);

	return (
		<>
			<form onSubmit={handleSubmit}>
				<fieldset disabled={isBusy}>
					<TextareaControl
						label="Add Note"
						onChange={setContent}
						value={content}
						required
					/>
					<Button
						isBusy={isBusy}
						variant="primary"
						type="submit"
						disabled={!content}
					>
						Save Note
					</Button>
				</fieldset>
			</form>
			{notes && notes.total > 0 && (
				<table className="table caption-top">
					<caption>Customer notes</caption>
					<thead>
						<tr>
							<th>Created</th>
							<th>Content</th>
							<th>Author</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{notes &&
							notes.data.map((note) => (
								<tr>
									<td>
										{new Intl.DateTimeFormat('en-US', {
											dateStyle: 'short',
											timeStyle: 'short',
										}).format(new Date(note.created_at))}
									</td>
									<td>{note.content}</td>
									<td>
										<a href={`#!/admin/${note.admin.id}`}>
											<strong>{note.admin.name}</strong>
										</a>
									</td>
									<td style={{ textAlign: 'end' }}>
										<DeleteButton
											isBusy={isBusy}
											modelName="note"
											onDelete={() =>
												handleDelete(note.id)
											}
										/>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
			{notes && notes?.last_page > 1 && (
				<Button
					isBusy={isBusy}
					onClick={handleMore}
					style={{ marginTop: '8px' }}
					variant="secondary"
				>
					Load More
				</Button>
			)}
		</>
	);
};

AccountNotes.propTypes = {
	customerId: PropTypes.number.isRequired,
	notes: PropTypes.object.isRequired,
};
