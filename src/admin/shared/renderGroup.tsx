import { Link } from '@mui/material';

export const renderGroup = (group: { group_id: number; name: string }) => {
	return group ? (
		<>
			<Link
				href={`${location.pathname}?page=vendorfuel#!/customers/groups/${group.group_id}`}
				underline="hover"
				variant="inherit"
			>
				{group.name ? group.name : '(Untitled)'}
			</Link>
		</>
	) : (
		<>&mdash;</>
	);
};
