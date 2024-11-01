import { Button, Flex, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';

interface Props {
	modelName?: string;
	modelId: number;
	onDelete: (id: number) => void;
}

export const DeleteButton = (props: Props) => {
	const [isOpen, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const handleDelete = () => {
		props.onDelete(props.modelId);
		closeModal();
	};

	return (
		<>
			<Button variant="tertiary" isDestructive onClick={openModal}>
				Delete
			</Button>
			{isOpen && (
				<Modal
					title={`Delete this${
						props.modelName ? ` ${props.modelName}` : ''
					}?`}
					onRequestClose={closeModal}
				>
					<p>This will delete this {props.modelName || 'item'}.</p>
					<Flex justify={'end'} gap={1}>
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
