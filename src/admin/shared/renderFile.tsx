import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { Chip } from '@mui/material';

export const renderFile = (filename: string = '(Untitled)') => {
	return (
		<Chip
			color="primary"
			label={`${filename}`}
			icon={<DownloadForOfflineIcon />}
			sx={{ cursor: 'pointer' }}
			title={`Download ${filename}`}
		/>
	);
};
