export const isAnId = (value: unknown) => {
	return Number(value) > 0 && Number.isInteger(Number(value));
};
