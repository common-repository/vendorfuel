export const convertToComboOptions = ({
	data,
	labelKey,
	valueKey,
}: {
	data: any[];
	labelKey: string;
	valueKey: string;
}): { label: string; value: string }[] => {
	return data.map((option) => {
		const label = option[labelKey];
		const value = option[valueKey];
		return { label, value };
	});
};
