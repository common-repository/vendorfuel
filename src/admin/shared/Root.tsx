import { useEffect } from '@wordpress/element';
import { Outlet, useLocation } from 'react-router-dom';
import { NavBar } from './NavBar';
import { ScrollToTop } from './ScrollToTop';
import { Toasts } from './Toasts';

export const Root = () => {
	const myLocation = useLocation();

	useEffect(() => {
		const menuItem = document.querySelector(
			`#toplevel_page_vendorfuel a[href$="${myLocation.pathname}"]`
		);

		const submenu = document.querySelectorAll(
			'li.toplevel_page_vendorfuel ul li'
		);

		if (menuItem) {
			submenu.forEach((element) => {
				element.classList.remove('current');
			});
			menuItem.parentElement.classList.add('current');
		}
	}, [myLocation]);

	return (
		<>
			<NavBar />
			<Outlet />
			<ScrollToTop />
			<Toasts />
		</>
	);
};
