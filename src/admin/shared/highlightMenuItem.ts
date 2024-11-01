export function highlightMenuItem(key: string) {
	const menuItem = document.querySelector(`#vf-menu-item-${key}`);
	const submenu = document.querySelectorAll(
		'li.toplevel_page_vendorfuel ul li'
	);

	if (menuItem) {
		submenu.forEach((element) => {
			element.classList.remove('current');
		});

		menuItem?.parentElement?.parentElement?.classList.add('current');
	}
}
