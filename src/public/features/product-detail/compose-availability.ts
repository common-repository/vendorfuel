export function composeAvailability(status: string, qty?: number) {
	const url = 'https://schema.org/';

	if (status === 'active') {
		return qty !== 0 ? `${url}InStock` : `${url}OutOfStock`;
	} else if (status === 'backordered') {
		return `${url}BackOrder`;
	} else if (status === 'discontinued') {
		return `${url}Discontinued`;
	}
}
