import { Avatar } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { GridRenderCellParams } from '@mui/x-data-grid';

export const renderProductImage = (params: GridRenderCellParams<string>) => {
	return params.value ? (
		<Avatar alt="" src={params.value} variant="rounded" />
	) : (
		<Avatar variant="rounded">
			<InsertPhotoIcon />
		</Avatar>
	);
};
