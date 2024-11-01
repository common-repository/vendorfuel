import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@wordpress/components';

export const ButtonComponent = (props) => {
	const { label } = props;

	return <Button {...props}>{label}</Button>;
};

ButtonComponent.propTypes = {
	href: PropTypes.string,
	isBusy: PropTypes.bool,
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	variant: PropTypes.string,
};
