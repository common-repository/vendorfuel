import PropTypes from 'prop-types';

export const BadgeControl = ({ label }) => {
	const dangerColor = '#cc1818';
	const warningColor = '#f0b849';
	const successColor = '#4ab866';
	const defaultColor = '#0073aa';

	const dangerLabels = ['failures', 'inactive', 'missing'];
	const warningLabels = ['discontinued', 'backordered', 'unverified'];
	const successLabels = ['completed'];

	const backgroundColor = (): string => {
		if (successLabels.includes(label.toLowerCase())) {
			return successColor;
		}
		if (warningLabels.includes(label.toLowerCase())) {
			return warningColor;
		}
		return dangerLabels.includes(label.toLowerCase())
			? dangerColor
			: defaultColor;
	};

	const style = {
		backgroundColor: backgroundColor(),
		color: 'white',
		padding: '2px 4px',
		borderRadius: '2px',
		fontSize: '12px',
		textTransform: 'capitalize',
	};

	return <span style={style}>{label}</span>;
};

BadgeControl.propTypes = {
	label: PropTypes.string,
};
