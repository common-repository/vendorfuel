<?php

/**
 * Admin Page
 *
 * Creates the admin page and submenu pages.
 *
 * @package VendorFuel
 * @version 1.0.0
 */
class Vendorfuel_Admin_Page
{

	public function register_menu()
	{
		$slug = 'vendorfuel';
		$capability = 'edit_posts';
		$icon = 'data:image/svg+xml;base64,PHN2ZyBpZD0iYiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2OC45MSAxMTIuNjUiPjxwYXRoIGQ9Ik02MC4zMyw1MS4xMWMtMi4zMiw3LjIxLDguNDYsMTguNDEsNS42OSwzMC40My03LjExLDMwLjg4LTM4LjQ2LDMxLjMxLTM4LjgyLDMxLjA5bDguOC0zMS42OWg5LjA4bDIuNDUtOS4wOWgtOWMxLjcxLTcuOTksMS41My02LjUzLDkuNDktNy43Nyw1LjIxLTEuNzksNS42NS01Ljk4LDcuNzItMTIuNjcsMS4xMS02Ljg3LDkuNTItMTAuMywxMy4xNi0zLjctMy4yLTEuNzMtNi44LTEuNjMtOC41OCwzLjRaTTE3LjEzLDExMS43Nmw4LjQtMzAuODJoLTUuMzJsMi40NS05LjFoNS4zMmMyLjE5LTEwLjI1LDUuOTYtMTUuOSwxNy42MS0xNS42Myw4LS4xMSwxMC45OS0xMy41OCwxMC43LTIwLjM4LC44Ni0xNy45LTE5LjItMjMuNzUtOS41NC0zNS44My0xNC4zOSw1LjI5LTQuMzEsMTkuMTktNi44MiwyOC4wM0MyNi44Niw0MS42MS0uMDIsMzYuNjIsMCw2NS43NWMtLjE1LDIwLjA4LDE1LjU0LDE4LjA4LDE1LjQ1LDQ1Ljk3LC4zNCwuMDYsMS4yNCwuMDQsMS42OCwuMDRaTTU5LjQ0LDQxLjMxYzE2LjUzLTExLjI0LDEuMS0xNy4zOCw2LjQ3LTI4LTExLjU1LDkuNDktMi4xMSwxNy41NS02LjQ3LDI4WiIgZmlsbD0iI2E3YWFhZCIvPjwvc3ZnPg==';

		add_menu_page(
			'VendorFuel',
			'VendorFuel',
			$capability,
			$slug,
			array($this, 'render_page'),
			$icon,
		);

		$protected_submenus = array(
			array(
				'title' => 'Dashboard',
				'slug'  => 'vf-admin',
			),
			array(
				'title'   => 'Catalog',
				'slug'    => 'vf-catalog',
			),
			array(
				'title'   => 'Customers',
				'slug'    => 'vf-customers',
			),
			array(
				'title'   => 'Orders',
				'slug'    => 'orders',
				'isRoute' => true,
			),
			array(
				'title'   => 'Reports',
				'slug'    => 'reports',
				'isRoute' => true,
			),
			array(
				'title'   => 'Purchasing',
				'slug'    => 'vf-purchasing',
			),
			array(
				'title'   => 'Punchout',
				'slug'    => 'vf-punchout',
			),
			array(
				'title'   => 'Shipping',
				'slug'    => 'vf-shipping',
			),
			array(
				'title'   => 'Email',
				'slug'    => 'email',
				'isRoute' => true,
			),
			array(
				'title'   => 'Accounting',
				'slug'    => 'vf-accounting',
			),
			array(
				'title'   => 'Payments',
				'slug'    => 'payments',
				'isRoute' => true,
			),
			array(
				'title'   => 'Taxes',
				'slug'    => 'taxes',
				'isRoute' => true,
			),
			array(
				'title'   => 'Admin Users',
				'slug'    => 'vf-users',
			),
		);

		function render_menu_slug($submenu)
		{
			if (isset($submenu['isRoute']) && $submenu['isRoute']) {
				return 'vendorfuel#!/' . $submenu['slug'];
			};
			return $submenu['slug'];
		}

		function render_menu_title($submenu)
		{
			if (isset($submenu['isRoute']) && $submenu['isRoute']) {
				return '<span id="vf-menu-item-' . $submenu['slug'] . '">' . $submenu['title'] . '</span>';
			};
			return $submenu['title'];
		}

		function is_authed()
		{
			return isset($_COOKIE['vendorfuel-admin-tokena']) && isset($_COOKIE['vendorfuel-admin-tokenb']);
		}

		/**
		 * Add Sign in link if admin cookies have not been set.
		 */
		if (!is_authed()) {
			add_submenu_page(
				$slug,
				'Sign in',
				'Sign in',
				$capability,
				'vendorfuel#!/login',
				array($this, 'render_page')
			);
		}

		/**
		 * Add submenu items for authed users.
		 */
		foreach ($protected_submenus as $submenu) {
			if (is_authed()) {
				add_submenu_page(
					$slug,
					$submenu['title'],
					render_menu_title($submenu),
					$capability,
					render_menu_slug($submenu),
					array($this, 'render_page')
				);
			}
		}

		/**
		 * Add Settings page regardless of auth status, since the user needs to be able to update the API key.
		 */
		add_submenu_page(
			$slug,
			'Settings',
			'<span id="vf-menu-item-settings">Settings</span>',
			$capability,
			'vendorfuel#!/settings',
			array($this, 'render_page')
		);

		/**
		 * Add Sign out link if admin cookies have been set.
		 */
		if (is_authed()) {
			add_submenu_page(
				$slug,
				'Sign out',
				'Sign out',
				$capability,
				'vf-signout',
				array($this, 'render_page')
			);
		}

		remove_submenu_page($slug, $slug);
	}

	public function render_page()
	{
		$filename = plugin_dir_path(__FILE__) . 'views/submenu-page.php';
		if (file_exists($filename)) {
			require_once $filename;
		} else {
			wp_die("{$filename} not found.");
		}
	}
}
