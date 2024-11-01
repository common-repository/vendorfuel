import type { Localized } from '../types';
declare const localized: Localized;
export class LocalizedService {
	'api_key': string;
	debugMode: boolean;
	'plugin_data': {
		Author: string;
		AuthorName: string;
		AuthorURI: string;
		Description: string;
		DomainPath: string;
		Name: string;
		Network: boolean;
		PluginURL: string;
		RequiresPHP: string;
		RequiresWP: string;
		TextDomain: string;
		Title: string;
		UpdateURI: string;
		Version: string;
	};
	root: {
		url: string;
		path: string;
	};
	wpRestUrl: string;
	wpNonce: string;
	apiURL: string;

	constructor() {
		this.debugMode = localized.settings.general.debug;
		this.root = { url: localized.dir.url, path: localized.dir.root };
		this.apiURL = localized.apiURL;
		this.api_key = localized.settings.general.api_key;
		this.wpRestUrl = localized.dir.wpRestUrl + 'vendorfuel';
		this.wpNonce = localized.nonce;
	}
}
