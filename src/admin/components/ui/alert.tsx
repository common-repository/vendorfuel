import PropTypes from 'prop-types';

interface Props {
	context: 'info' | 'success' | 'warning' | 'danger';
	children: any;
}

export const Alert = ({ context, children }: Props) => {
	return <div className={`alert alert-${context}`}>{children}</div>;
};

Alert.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.element),
		PropTypes.element.isRequired,
	]),
	context: PropTypes.string,
};
