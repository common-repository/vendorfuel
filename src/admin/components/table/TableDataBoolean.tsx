import PropTypes from 'prop-types';
import { Icon } from '@wordpress/components';
import { check } from '@wordpress/icons';

export const TableDataBoolean = ({ value }) => {
	return value ? <Icon icon={check} /> : <></>;
};

TableDataBoolean.propTypes = {
	value: PropTypes.bool,
};
