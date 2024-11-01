import { GridValueFormatterParams } from '@mui/x-data-grid';

export const dateValueFormatter = (
	params: GridValueFormatterParams<string>
) => {
	if (params?.value) {
		if (isNaN(Date.parse(params.value))) {
			return params.value;
		}
		return new Intl.DateTimeFormat('en-US', {
			dateStyle: 'short',
			timeStyle: 'short',
		}).format(new Date(params.value));
	}
	return '—';
};
