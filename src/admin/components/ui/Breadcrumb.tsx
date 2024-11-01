import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Link, ThemeProvider } from '@mui/material';
import { theme } from '../../shared/theme';

interface Props {
	breadcrumbs: IBreadcrumb[];
}

export interface IBreadcrumb {
	label: string;
	to?: string;
	href?: string;
}

export const Breadcrumb = (props: Props) => {
	const { breadcrumbs } = props;

	const isLast = (index: number) => {
		return index + 1 === breadcrumbs.length;
	};

	const renderBreadcrumb = (item: IBreadcrumb, index: number) => {
		if (isLast(index)) {
			return <span>{item.label}</span>;
		}
		return renderLink(item);
	};

	const renderLink = (breadcrumb: IBreadcrumb) => {
		return breadcrumb.to ? (
			<RouterLink to={breadcrumb.to}>{breadcrumb.label}</RouterLink>
		) : (
			<Link href={`${location.pathname}${breadcrumb.href}`}>
				{breadcrumb.label}
			</Link>
		);
	};

	return (
		<ThemeProvider theme={theme}>
			<Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 1 }}>
				{breadcrumbs.map((item, i) => renderBreadcrumb(item, i))}
			</Breadcrumbs>
		</ThemeProvider>
	);
};

Breadcrumb.propTypes = {
	breadcrumbs: PropTypes.array.isRequired,
};
