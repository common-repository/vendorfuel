import { Link } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';

export const renderCategoryLink = (params: GridRenderCellParams<string>) => {
	const { category } = params.row;

	const path = '?page=vendorfuel#!/catalog/categories';

	if (category) {
		return (
			<Link
				noWrap
				href={`${path}/${category.cat_id}`}
				sx={{ textDecoration: 'none' }}
			>
				{category.title}
			</Link>
		);
	}
};
