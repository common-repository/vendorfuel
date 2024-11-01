import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';

type Color =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'error'
	| 'info'
	| 'success'
	| 'warning';

export const renderStatus = (params: GridRenderCellParams<string>) => {
	const { value } = params;
	const errorLabels = ['failures', 'inactive', 'missing'];
	const warningLabels = [
		'discontinued',
		'backordered',
		'unverified',
		'processing',
	];
	const successLabels = ['completed'];
	const primaryLabels = ['active'];

	const color = (): Color => {
		if (successLabels.includes(value.toLowerCase())) {
			return 'success';
		} else if (warningLabels.includes(value.toLowerCase())) {
			return 'warning';
		} else if (errorLabels.includes(value.toLowerCase())) {
			return 'error';
		} else if (primaryLabels.includes(value.toLowerCase())) {
			return 'primary';
		}
		return 'default';
	};

	return value ? (
		<Chip
			label={value}
			size="small"
			color={color()}
			sx={{ textTransform: 'capitalize' }}
		/>
	) : null;
};
