import PropTypes from 'prop-types';
import { Icon } from '@wordpress/components';
import { check } from '@wordpress/icons';

export const TableData = ({ value, type }) => {
	switch (type) {
		case 'boolean':
			return <td>{value ? <Icon icon={check} /> : <></>}</td>;
		case 'currency':
			return (
				<td>
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
					}).format(value)}
				</td>
			);
		default:
			return <td>{value || <>&mdash;</>}</td>;
	}
};

TableData.propTypes = {
	value: PropTypes.any,
	type: PropTypes.string, // Expects 'badge', 'boolean', 'currency', 'date', 'number'.
};
