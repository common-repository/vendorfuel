import { ValidationIndicator } from './ValidationIndicator';

export const ValidationIndicators = (props) => {
	const { value } = props;

	const listItemStyle = {
		marginBottom: '0',
	};

	const hasMin = (input: string): boolean => {
		const min = 8;
		if (input) {
			return input.length >= min;
		}
		return false;
	};

	const hasUppercase = (input: string): boolean => {
		const uppercase = /[A-Z]/g;
		if (input) {
			return uppercase.test(input);
		}
		return false;
	};

	const hasLowercase = (input: string): boolean => {
		const lowercase = /[a-z]/g;
		if (input) {
			return lowercase.test(input);
		}
		return false;
	};

	const hasNumber = (input: string): boolean => {
		const regex = /[0-9]/g;
		if (input) {
			return regex.test(input);
		}
		return false;
	};

	const hasSymbol = (input: string): boolean => {
		const regex = /[!@#$%^&*-]/g;
		if (input) {
			return regex.test(input);
		}
		return false;
	};

	return (
		<ul
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '4px',
				padding: '0',
			}}
		>
			<li style={listItemStyle}>
				<ValidationIndicator valid={hasMin(value)}>
					8 characters
				</ValidationIndicator>
			</li>
			<li style={listItemStyle}>
				<ValidationIndicator valid={hasUppercase(value)}>
					uppercase letter
				</ValidationIndicator>
			</li>
			<li style={listItemStyle}>
				<ValidationIndicator valid={hasLowercase(value)}>
					lowercase letter
				</ValidationIndicator>
			</li>
			<li style={listItemStyle}>
				<ValidationIndicator valid={hasNumber(value)}>
					number
				</ValidationIndicator>
			</li>
			<li style={listItemStyle}>
				<ValidationIndicator valid={hasSymbol(value)}>
					symbol
				</ValidationIndicator>
			</li>
		</ul>
	);
};
