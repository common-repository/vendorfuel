import { Avatar } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

export const renderThumbnail = (imgUrl?: string) => {
	return imgUrl ? (
		<Avatar alt="" src={imgUrl} variant="rounded" />
	) : (
		<Avatar variant="rounded">
			<InsertPhotoIcon />
		</Avatar>
	);
};
