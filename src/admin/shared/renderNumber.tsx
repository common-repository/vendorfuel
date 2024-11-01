export const renderNumber = (value?: string | number | null) => {
	return value === null ? (
		<>&mdash;</>
	) : (
		<>{new Intl.NumberFormat('en-US').format(Number(value))}</>
	);
};
