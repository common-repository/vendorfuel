import { useEffect, useState } from '@wordpress/element';
import { BaseControl, Button, Flex, TextControl } from '@wordpress/components';
import { ValidationIndicators } from './ValidationIndicators';
import PropTypes from 'prop-types';
import { ValidationIndicator } from './ValidationIndicator';

export const PasswordControl = (props) => {
	const { confirmation, label, hasValidation, onChange, value } = props;

	const [buttonLabel, setButtonLabel] = useState('Show password');
	const [help, setHelp] = useState(
		hasValidation
			? 'Please enter a password containing at least 8 characters, one uppercase letter, one lowercase letter, one number, one symbol.'
			: props.help
	);
	const [touched, setTouched] = useState(false);
	const [uuId] = useState(`password-control-${new Date().valueOf()}`);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setButtonLabel(visible ? 'Hide password' : 'Show password');
	}, [visible]);

	useEffect(() => {
		if (!touched && value?.length) {
			setTouched(true);
		}
	}, [value]);

	return (
		<>
			<BaseControl id={uuId} label={label} help={help}>
				<Flex gap={0} justify="start" align="center">
					<TextControl
						id={uuId}
						value={value}
						onChange={onChange}
						type={visible ? 'text' : 'password'}
						autoComplete="new-password"
						spellCheck={false}
						style={{
							height: '32px',
							borderTopRightRadius: '0',
							borderBottomRightRadius: '0',
							borderRight: 'none',
						}}
					/>
					<Button
						variant="secondary"
						icon={visible ? 'visibility' : 'hidden'}
						style={{
							height: '32px',
							marginBottom: 'calc(4px * 2)',
							borderTopLeftRadius: '0',
							borderBottomLeftRadius: '0',
						}}
						onClick={() => setVisible(!visible)}
						label={buttonLabel}
					/>
				</Flex>
			</BaseControl>
			{touched && confirmation && (
				<ValidationIndicator valid={confirmation === value}>
					{confirmation === value
						? 'Password confirmed.'
						: 'Please confirm your password.'}
				</ValidationIndicator>
			)}
			{hasValidation && <ValidationIndicators value={value} />}
		</>
	);
};

PasswordControl.propTypes = {
	confirmation: PropTypes.string,
	label: PropTypes.string,
	hasValidation: PropTypes.bool,
	onChange: PropTypes.func,
	value: PropTypes.string,
};
