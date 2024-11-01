import React, { useEffect, useState } from '@wordpress/element';
import { Button, Flex } from '@wordpress/components';
import Cookies from 'universal-cookie';
import { NavigationDropdownMenu } from './NavigationDropdownMenu';
import { Brand } from './Brand';
import { CatalogDropdown } from './CatalogDropdown';
import { CustomersDropdown } from './CustomersDropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './header.scss';

export const Header = () => {
	const rootURL = `${location.origin}${location.pathname}`;
	const url = `${rootURL}?page=vendorfuel#!/`;

	const [isAuthed, setAuthed] = useState<boolean>(false);

	const hasTokens = () => {
		const cookies = new Cookies();
		const tokena = cookies.get('vendorfuel-admin-tokena');
		const tokenb = cookies.get('vendorfuel-admin-tokenb');

		return tokena && tokenb;
	};

	useEffect(() => {
		setAuthed(hasTokens());
	}, []);

	return (
		<>
			<header>
				<Flex>
					<Brand />
					<Flex justify={'end'}>
						{isAuthed && (
							<>
								<CatalogDropdown />
								<CustomersDropdown />
								<Button
									variant="tertiary"
									href={`${url}orders`}
								>
									Orders
								</Button>
								<Button
									variant="tertiary"
									href={`${url}reports`}
								>
									Reports
								</Button>
							</>
						)}
						<NavigationDropdownMenu isAuthed={isAuthed} />
					</Flex>
				</Flex>
			</header>
			<ToastContainer
				newestOnTop
				pauseOnFocusLoss
				pauseOnHover
				position={toast.POSITION.BOTTOM_RIGHT}
				theme="dark"
			/>
		</>
	);
};
