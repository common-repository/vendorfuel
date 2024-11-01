import { Flex, Spinner } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import Cookies from 'universal-cookie';

export const SignoutPage = () => {
	const cookies = new Cookies();

	useEffect( () => {
		const tokena = cookies.get( 'vendorfuel-admin-tokena' );
		const tokenb = cookies.get( 'vendorfuel-admin-tokenb' );

		if ( tokena && tokenb ) {
			const options = {
				path: '/',
				sameSite: true,
				secure: true,
			};
			cookies.remove( 'vendorfuel-admin-tokena', options );
			cookies.remove( 'vendorfuel-admin-tokenb', options );
			cookies.remove( 'vendorfuel-admin-name', options );
			cookies.remove( 'vendorfuel-tenant-token', options );

			const url = `${ location.pathname }?page=vendorfuel#!/${ localized.settings.general.api_key ? 'login' : 'settings' }`;
			window.location.assign( url );
		}
	}, [] );

	return (
		<Flex justify={ 'center' }>Signing out&hellip;<Spinner /></Flex>
	);
};
