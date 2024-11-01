import { Modal } from 'bootstrap';
import { useEffect, useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import { vfAPI } from '../../shared/vfAPI';
import type { Localized } from '../../types';
import { Spinner } from '../../components/spinner/Spinner';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';

declare const localized: Localized;

interface Config {
	params: {
		group_id: number;
		note_id?: number | null;
	};
}

interface Note {
	note: string;
	datetime: string;
	note_id: number;
	admin: {
		first_name?: string;
		last_name?: string;
		name: string;
	};
}

interface Props {
	groupId: number;
}

export const GroupNotes = (props: Props) => {
	const { groupId } = props;
	const config: Config = {
		params: {
			group_id: props.groupId,
		},
	};
	const nextApiURL = localized.apiURL.replace('v1', 'v2');

	const [hasResolved, setResolved] = useState(false);
	const [id, setId] = useState<number | null>();
	const [isBusy, setBusy] = useState(false);
	const [notes, setNotes] = useState([]);

	const authorInitials = (admin: {
		first_name?: string;
		last_name?: string;
		name: string;
	}) => {
		if (admin.first_name && admin.last_name) {
			return `${admin.first_name[0].toLocaleUpperCase()}${admin.last_name[0].toLocaleUpperCase()}`;
		} else if (admin.name) {
			const [first, last] = admin.name.split(' ');
			return `${first[0].toLocaleUpperCase()}${last[0].toLocaleUpperCase()}`;
		}
		return 'VF';
	};

	const closeModal = () => {
		const modal = Modal.getOrCreateInstance('#confirmationModal');
		modal.hide();
	};

	const destroyNote = () => {
		setBusy(true);
		config.params.note_id = id;
		const url = `${nextApiURL}/admin/customers/groups/${groupId}/notes/${id}`;

		vfAPI
			.delete(url, config)
			.then((response) => {
				if (!response.data.errors.length) {
					setId(null);
					setBusy(false);
					index();
				}
			})
			.finally(() => {
				closeModal();
			});
	};

	const index = () => {
		setBusy(true);
		const url = `${nextApiURL}/admin/customers/groups/${groupId}/notes`;

		vfAPI.get(url, config).then((response) => {
			if (!response.data.errors.length) {
				setNotes(response.data.notes.reverse());
				setResolved(true);
				setBusy(false);
			}
		});
	};

	const handleDelete = (deleteId: number) => {
		setId(deleteId);
		openModal();
	};

	const openModal = () => {
		const modal = Modal.getOrCreateInstance('#confirmationModal');
		modal.show();
	};

	const store = (note: string) => {
		const url = `${nextApiURL}/admin/customers/groups/${groupId}/notes`;
		const data = { note };
		return vfAPI.post(url, data, config);
	};

	const validationSchema = Yup.object({ note: Yup.string().required() });

	useEffect(() => {
		if (props.groupId) {
			index();
		}
	}, [props.groupId]);

	return (
		<>
			<h3 className="h5">Notes</h3>
			<Formik
				initialValues={{ note: '' }}
				onSubmit={(values, { resetForm }) => {
					store(values.note).then((response) => {
						if (!response.data.errors.length) {
							resetForm();
							index();
						}
					});
				}}
				validationSchema={validationSchema}
			>
				{({ isSubmitting, errors, touched }) => (
					<Form>
						<div className="mb-3">
							<label htmlFor="note" className="form-label">
								Add New Note
							</label>
							<Field
								as="textarea"
								name="note"
								id="note"
								disabled={isSubmitting}
								className={`form-control ${
									touched.note && errors.note
										? 'is-invalid'
										: ''
								}`}
							/>
							<div className="invalid-feedback">
								{errors.note}
							</div>
						</div>
						<button
							type="submit"
							className="btn btn-primary btn-sm"
							disabled={isSubmitting}
						>
							Save
						</button>
					</Form>
				)}
			</Formik>

			{notes.length ? (
				<ul className="list-group mt-3">
					{notes.map((item: Note) => (
						<li className="list-group-item" key={item.note_id}>
							<div className="row py-2">
								<div className="col-auto">
									<div
										className="badge fs-4 fw-normal py-3 bg-secondary rounded-pill text-white"
										title={`${item.admin.name}`}
									>
										{authorInitials(item.admin)}
									</div>
								</div>
								<div className="col">
									<p className="mb-1">{item.note}</p>
									<p className="small mb-0 text-muted">
										{formatDistance(
											new Date(item.datetime),
											new Date(),
											{ addSuffix: true }
										)}
									</p>
								</div>
								<div className="col-auto">
									<button
										className="btn btn-outline-danger border-0 btn-sm"
										onClick={() => {
											handleDelete(item.note_id);
										}}
									>
										Delete
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			) : null}

			<div
				className="modal fade"
				id="confirmationModal"
				aria-labelledby="confirmationModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1
								className="modal-title fs-5"
								id="confirmationModalLabel"
							>
								Delete this note?
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							This will delete this note from this group.
						</div>
						<div className="modal-footer">
							<button
								className="btn btn-outline-secondary border-0"
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
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

GroupNotes.propTypes = {
	groupId: PropTypes.number.isRequired, // Group ID
};
