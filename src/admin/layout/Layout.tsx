import { Typography } from '@mui/material';
import { useEffect } from '@wordpress/element';
import { Breadcrumb, IBreadcrumb } from '../shared/Breadcrumb';
import { PageHeading } from '../shared/PageHeading';
import type { Link } from '../shared/Link';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
	action?: Link;
	breadcrumbs?: IBreadcrumb[];
	children: React.ReactNode | React.ReactNode[];
	heading: string;
	nav?: Link[];
	parent?: { label: string; to: string };
}

export const Layout = (props: Props) => {
	const { action, breadcrumbs, children, heading, nav, parent } = props;

	useEffect(() => {
		if (heading) {
			document.title = `VendorFuel: ${heading} ‹ ${localized.bloginfo.name} — WordPress`;
		}
	}, []);

	return (
		<div>
			{breadcrumbs ? <Breadcrumb breadcrumbs={breadcrumbs} /> : null}
			{parent ? (
				<Typography
					component={RouterLink}
					to={parent.to}
					variant="subtitle1"
					gutterBottom
				>
					{parent.label}
				</Typography>
			) : null}
			<PageHeading heading={heading} action={action} nav={nav} />
			{children}
		</div>
	);
};
