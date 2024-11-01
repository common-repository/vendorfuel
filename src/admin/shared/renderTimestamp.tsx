export const renderTimestamp = (timestamp?: string) => {
	return timestamp ? (
		<>
			{new Intl.DateTimeFormat('en-US', {
				dateStyle: 'short',
				timeStyle: 'short',
			}).format(new Date(timestamp))}
		</>
	) : (
		<>&mdash;</>
	);
};
