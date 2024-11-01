import type { Localized } from '../types';
declare const localized: Localized;

export const nextApiURL = localized.apiURL.replace('v1', 'v2');
