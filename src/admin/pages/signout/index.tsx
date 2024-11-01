import { useEffect } from '@wordpress/element';
import Cookies from 'universal-cookie';

export const SignoutPage = () => {
	const cookies = new Cookies();

	useEffect(() => {
		const tokena = cookies.get('vendorfuel-admin-tokena');
		const tokenb = cookies.get('vendorfuel-admin-tokenb');
		const url = `${location.pathname}?page=vendorfuel#!/${
			localized.settings.general.api_key ? 'login' : 'settings'
		}`;

		if (tokena && tokenb) {
			const options = {
				path: '/',
				sameSite: true,
				secure: true,
			};
			cookies.remove('vendorfuel-admin-tokena', options);
			cookies.remove('vendorfuel-admin-tokenb', options);
			cookies.remove('vendorfuel-admin-name', options);
		}
		window.location.assign(url);
	}, []);

	return (
		<div className="d-flex align-items-center">
			<strong>Signing out...</strong>
			<div
				className="spinner-border ms-auto"
				role="status"
				aria-hidden="true"
			></div>
		</div>
	);
};
