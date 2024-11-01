import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const DeleteDialog = (props) => {
	const { params, open, queryKey, service, setOpen } = props;

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (id) => {
			return service.destroy(id).then(() => {
				setOpen(false);
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [queryKey],
			});
		},
	});

	const handleClose = () => {
		setOpen(false);
	};

	const itemName = (item) => {
		if (item) {
			return (
				<em>
					{item.name || item.title || item.description || 'this item'}
				</em>
			);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">Delete this?</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					This will delete{' '}
					{params?.row ? itemName(params?.row) : 'this item'}. Are you
					sure?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button
					onClick={() => {
						mutation.mutate(params?.id);
					}}
					color="warning"
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};
