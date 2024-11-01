import { Chip } from '@mui/material';

type Color =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'error'
	| 'info'
	| 'success'
	| 'warning';

export const renderBadge = (value: string) => {
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
