export const convertIntToBoolean = (value: number | boolean): boolean => {
	if (typeof value === 'boolean') {
		return value;
	}
	return value === 1;
};
