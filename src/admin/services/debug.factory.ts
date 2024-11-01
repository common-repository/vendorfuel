export function debugFactory() {
	const service = {
		error,
		log,
	};

	return service;

	/**
	 * @param {...any} params Parameters
	 */
	function log(...params: any[]) {
		if (localized.settings.general.debug) {
			console.debug(...params);
		}
	}

	/**
	 * @param {...any} params Parameters
	 */
	function error(...params: any[]) {
		if (localized.settings.general.debug) {
			console.error(...params);
		}
	}
}
