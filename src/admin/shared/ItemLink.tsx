import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GridRenderCellParams } from '@mui/x-data-grid';

interface Props {
	params: GridRenderCellParams;
	path?: string;
}

export const ItemLink = (props: Props) => {
	const { params, path } = props;
	return (
		<Link
			component={path ? 'a' : RouterLink}
			href={path ? `${path}/${params.id}` : null}
			noWrap
			sx={{ textDecoration: 'none' }}
			to={path ? null : `./${params.id}`}
		>
			{params.value}
		</Link>
	);
};
