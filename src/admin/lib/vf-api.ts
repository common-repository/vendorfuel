import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { handleNotifications } from '../utils/handleNotifications';
import type { Localized } from '../types';
declare const localized: Localized;

const cookies = new Cookies();

export const vfApi = axios.create({
	baseURL: `${localized.apiURL}/admin`,
	params: {
		apikey: localized.settings.general.api_key,
	},
});

vfApi.interceptors.request.use(
	(config) => {
		// Add tokens with each request, since the cookies may not be set or available when the Axios instance is created.
		const tokena = cookies.get('vendorfuel-admin-tokena');
		const tokenb = cookies.get('vendorfuel-admin-tokenb');

		if (tokena && tokenb) {
			config.params.tokena = tokena;
			config.params.tokenb = tokenb;
			return config;
		}
		// If tokens are missing, redirect to either login or settings page.
		const url = `${location.pathname}?page=vendorfuel#!/${
			localized.settings.general.api_key ? 'login' : 'settings'
		}`;
		location.assign(url);
	},
	(error) => {
		return Promise.reject(error);
	}
);

vfApi.interceptors.response.use(
	(response) => {
		handleNotifications(response.data);
		return response;
	},
	(error) => {
		if (error.message && error.code !== 'ECONNABORTED') {
			toast.error(error.message);
		}
		return Promise.reject(error);
	}
);
