import { useState } from '@wordpress/element';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { DeleteDialog } from './DeleteDialog';
import { Resource } from './Resource';

interface Props {
	actions: {
		disabled(item: { [key: string]: unknown }): boolean;
		name: string;
		type: string;
		callback: (id: number, item?: unknown) => void;
	}[];
	canDelete?: boolean;
	canEdit?: boolean;
	canView?: boolean;
	id: number;
	item: { [key: string]: unknown };
	linkToLegacyRoute?: string;
	resource: Resource;
}

export const TableActions = (props: Props) => {
	const {
		actions,
		canDelete,
		canEdit,
		canView,
		id,
		item,
		linkToLegacyRoute,
		resource,
	} = props;

	const navigate = useNavigate();

	const renderIcon = (type: string) => {
		if (type === 'download') {
			return <DownloadIcon />;
		} else if (type === 'view') {
			return <VisibilityIcon />;
		}
	};

	const [open, setOpen] = useState(false);

	const handleClickAction = (
		event: React.MouseEvent<unknown>,
		action: { callback: (id: number, item?: unknown) => void }
	) => {
		event.preventDefault();
		action.callback(id, item);
	};

	const handleClickEdit = () => {
		if (linkToLegacyRoute) {
			const url = new URL(
				`${location.origin}${location.pathname}${linkToLegacyRoute}/${id}`
			);
			location.assign(url);
		} else {
			navigate(`${id}`);
		}
	};

	const handleDelete = () => {
		setOpen(true);
	};

	return (
		<>
			{actions ? (
				actions.map((action, i) => (
					<IconButton
						key={i}
						title={action.name}
						onClick={(e) => {
							handleClickAction(e, action);
						}}
						disabled={
							action.disabled ? action.disabled(item) : false
						}
					>
						{renderIcon(action.type)}
					</IconButton>
				))
			) : (
				<></>
			)}
			{canEdit || canView ? (
				<IconButton
					title={canEdit ? 'Edit' : 'View'}
					onClick={handleClickEdit}
				>
					{canEdit ? <ModeEditIcon /> : <VisibilityIcon />}
				</IconButton>
			) : null}
			{canDelete ? (
				<IconButton title="Delete" onClick={handleDelete}>
					<DeleteIcon />
				</IconButton>
			) : null}
			<DeleteDialog
				open={open}
				setOpen={setOpen}
				model={item}
				id={id}
				resource={resource}
			/>
		</>
	);
};
