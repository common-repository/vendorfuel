import { Flex, Spinner } from '@wordpress/components';
import { Component } from 'react';
import Cookies from 'universal-cookie';

interface State {
	isSignedIn: boolean;
}

export const withAuth = (WrappedComponent) => {
	class WithAuth extends Component<Record<string, never>, State> {
		constructor(props: Record<string, never>) {
			super(props);
			this.state = { isSignedIn: false };
		}

		/**
		 * Checks authentication, showing the component if signed in, or redirecting to login page.
		 */
		checkAuth() {
			const cookies = new Cookies();
			const tokena = cookies.get('vendorfuel-admin-tokena');
			const tokenb = cookies.get('vendorfuel-admin-tokenb');

			if (tokena && tokenb) {
				this.setState({ isSignedIn: true });
			} else {
				const url = `${location.pathname}?page=vendorfuel#!/${
					localized.settings.general.api_key ? 'login' : 'settings'
				}`;
				location.assign(url);
			}
		}

		componentDidMount() {
			this.checkAuth();
		}
		render() {
			return this.state.isSignedIn ? (
				<WrappedComponent />
			) : (
				<Flex justify={'center'}>
					<Spinner />
				</Flex>
			);
		}
	}
	return WithAuth;
};
