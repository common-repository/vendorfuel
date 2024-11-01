import angular from 'angular';

utilsService.$inject = ['Debug'];

export function utilsService(Debug: any) {
	const self = this;
	const parser: any = document.createElement('a');
	parser.href = window.location.href;
	parser._params = {};
	parser._pathPieces = parser.pathname.replace(/^\/+|\/+$/g, '').split('/');
	const paramString = parser.search;

	if (paramString.charAt(0) === '?') {
		const hashes = paramString.slice(1).split('&');

		for (let i = 0; i < hashes.length; i++) {
			const hash = hashes[i].split('=');
			parser._params[hash[0]] = hash[1];
		}
	}
	/**
	 * Parses params from key.
	 *
	 * @param {string} key
	 * @return {string}
	 */

	parser.param = function (key: string) {
		return parser._params[key];
	};
	/**
	 * Parses path pieces from index.
	 *
	 * @param {number} index
	 * @return {Array}
	 */

	parser.pathPiece = function (index: number) {
		return parser._pathPieces[index];
	};

	self.urlParser = parser;
	/**
	 * Navigate to specified page with the attached params.
	 *
	 * @param {string} page
	 * @param {Object} params
	 */

	self.goToPage = function (page: string) {
		window.location.href = page;
	};

	this.getPageUrl = (pageKey: string, params?: { string: string }) => {
		Debug.log(`Getting page URL for "${pageKey}".`);

		if (localized.pages[pageKey]) {
			const page = localized.pages[pageKey];
			let url = page.url;

			if (!angular.isUndefined(params) && angular.isObject(params)) {
				url += '?';
				angular.forEach(params, function (val, key) {
					url +=
						encodeURIComponent(key) + '=' + encodeURIComponent(val);
				});
			}
			return url;
		}
		Debug.warn(`Unable to find mapped page with key "${pageKey}".`);
		return `${location.origin}/${pageKey}`;
	};
}
