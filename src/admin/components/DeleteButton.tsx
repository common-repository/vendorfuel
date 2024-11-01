import { Button, Flex, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import PropTypes from 'prop-types';

export const DeleteButton = (props) => {
	const { isBusy, modelName, onDelete } = props;
	const [isOpen, setOpen] = useState(false);
	const closeModal = () => setOpen(false);
	const openModal = () => setOpen(true);

	const handleDelete = () => {
		onDelete();
		closeModal();
	};

	return (
		<>
			<Button
				icon="trash"
				isBusy={isBusy}
				isDestructive
				isSmall
				label={`Delete${modelName ? ` ${modelName}` : ''}`}
				onClick={openModal}
				variant="tertiary"
			/>
			{isOpen && (
				<Modal
					title={`Delete ${modelName || 'this'}?`}
					onRequestClose={closeModal}
				>
					<p>This will delete this {modelName || 'item'}.</p>
					<Flex justify="end">
						<button
							className="btn btn-outline-primary"
							onClick={closeModal}
						>
							Cancel
						</button>
						<button
							className="btn btn-danger"
							onClick={handleDelete}
						>
							Delete
						</button>
					</Flex>
				</Modal>
			)}
		</>
	);
};

DeleteButton.propTypes = {
	isBusy: PropTypes.bool,
	modelName: PropTypes.string,
	onDelete: PropTypes.func.isRequired,
};
