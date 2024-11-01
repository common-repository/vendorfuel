export function formatURLParams(
	href: string,
	params: { key: string; value: string }
) {
	const url = new URL(href);
	Object.entries(params).forEach((entry) => {
		const [key, value] = entry;
		url.searchParams.set(key, value);
	});

	return url.href;
}
