import { Link } from '@mui/material';

export const renderCategory = (category: { cat_id: any; title: string }) => {
	return category ? (
		<>
			<Link
				href={`${location.pathname}?page=vendorfuel#!/catalog/categories/${category.cat_id}`}
				underline="hover"
				variant="inherit"
			>
				{category.title ? category.title : '(Untitled)'}
			</Link>
		</>
	) : (
		<>&mdash;</>
	);
};
