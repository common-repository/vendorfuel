export function debug(...params: unknown[]) {
	if (localized.settings.general.debug) {
		console.debug('VendorFuel debug: ', ...params);
	}
}
