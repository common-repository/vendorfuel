import { Icon } from '@wordpress/components';

export const ValidationIndicator = (props) => {
	const inValidColor = '#cc1818';
	const validColor = '#4ab866';
	const { valid } = props;
	return (
		<span style={{ color: valid ? validColor : inValidColor }}>
			<Icon
				icon={valid ? 'yes-alt' : 'no'}
				style={{ marginRight: '2px' }}
			/>
			{props.children}
		</span>
	);
};
