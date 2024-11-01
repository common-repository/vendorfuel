import PropTypes from 'prop-types';
import { Link } from '../../models/link';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';

interface Props {
	action?: Link;
	heading: string;
	nav?: Link[];
}

export const PageHeading = (props: Props) => {
	const { action, heading, nav } = props;

	return (
		<div className="mb-3 d-md-flex align-items-baseline gap-2">
			<h1>{heading}</h1>
			{action && (
				<Button
					component={action.to ? RouterLink : 'a'}
					href={action.href || null}
					size="small"
					to={action.to}
					variant="outlined"
				>
					{action.label}
				</Button>
			)}
			{nav ? (
				<ul className="nav ms-auto">
					{nav.map((item, i) => (
						<li className="nav-item" key={i}>
							{item.href ? (
								<a className="nav-link" href={item.href}>
									{item.label}
								</a>
							) : (
								<RouterLink to={item.to} className="nav-link">
									{item.label}
								</RouterLink>
							)}
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
};

PageHeading.propTypes = {
	action: PropTypes.object,
	heading: PropTypes.string.isRequired,
	nav: PropTypes.array,
};
