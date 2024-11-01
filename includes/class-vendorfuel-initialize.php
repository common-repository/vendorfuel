<?php

class Vendorfuel_Initialize {

	private function create_pages() {
		$option = 'vendorfuel-anguledit-settings';
		$anguledit_options = get_option($option);

		$pages     = array(
			array(
				'title'    => 'Account',
				'template' => 'account',
			),
			array(
				'title'    => 'Addresses',
				'template' => 'addresses',
			),
			array(
				'title'    => 'Cart',
				'template' => 'cart',
			),
			array(
				'title'    => 'Catalog',
				'template' => 'catalog',
			),
			array(
				'title'    => 'cc-return',
				'template' => 'cc-return',
			),
			array(
				'title'    => 'Checkout',
				'template' => 'checkout',
			),
			array(
				'title'    => 'Favorites',
				'template' => 'favorites',
			),
			array(
				'title'    => 'Forgot Password',
				'template' => 'forgot-password',
			),
			array(
				'title'    => 'Group Account',
				'template' => 'group-account',
			),
			array(
				'title'    => 'Group Orders',
				'template' => 'group-orders',
			),
			array(
				'title'    => 'Login',
				'template' => 'login',
			),
			array(
				'title'    => 'Order by SKU',
				'template' => 'order-by-sku',
			),
			array(
				'title'    => 'Orders',
				'template' => 'orders',
			),
			array(
				'title'    => 'Punchout Return',
				'template' => 'punchout-return',
			),
			array(
				'title'    => 'Register',
				'template' => 'register',
			),
			array(
				'title'    => 'Reset Password',
				'template' => 'reset-password',
			),
			array(
				'title'    => 'Saved Cart',
				'template' => 'saved-cart',
			),
			array(
				'title'    => 'Saved Carts',
				'template' => 'saved-carts',
			),
			array(
				'title'    => 'View Order',
				'template' => 'view-order',
			),
			array(
				'title'    => 'Welcome',
				'template' => 'welcome',
			),
		);
		$template_map = array();

		foreach ($pages as $page) {
			$temp_page = get_page_by_title($page['title']);
			if (!$temp_page && '' !== $page['title']) {
				$slug                  = strtolower(str_replace(' ', '-', $page['title']));
				$new_page              = array(
					'post_title'   => wp_strip_all_tags($page['title']),
					'post_content' => '
						<!-- wp:shortcode -->
						[vf-template name="' . $page['template'] . '"]
						<!-- /wp:shortcode -->',
					'post_type'    => 'page',
					'post_status'  => 'publish',
					'post_slug'    => $slug,
				);
				$id                    = wp_insert_post($new_page);
				$page_url              = get_permalink($id);
				$template_map[$slug] = array(
					'title'    => $page['title'],
					'template' => $page['template'],
					'url'      => $page_url,
					'id'       => $id,
				);
			} elseif (null !== $temp_page) {
				$temp_page             = $temp_page->to_array();
				$id                    = $temp_page['ID'];
				$slug                  = strtolower(str_replace(' ', '-', $page['title']));
				$page_url              = get_permalink($id);
				$template_map[$slug] = array(
					'title'    => $page['title'],
					'template' => $page['template'],
					'url'      => $page_url,
					'id'       => $id,
				);
			}
		}
		if (!empty($template_map)) {
			if ($anguledit_options->template_map) {
				$template_map = array_merge($template_map, json_decode(wp_json_encode($anguledit_options->template_map), true));
			}
			$settings = array(
				'template_map'    => json_decode(wp_json_encode($template_map), true),
			);
			update_option($option, json_decode(wp_json_encode($settings), false));
		}
	}

	private function create_settings() {
		$this->set_general_settings();
		$this->set_conversion_settings();
		$this->set_store_options();
		$this->set_anguledit_settings();
		$this->set_analytics_settings();
	}

	public function initialize() {
		$this->create_settings();
		$this->create_pages();
	}

	/**
	 * Sets or updates Analytics settings.
	 *
	 * @since 8.22.0
	 */
	private function set_analytics_settings() {
		$option = 'vendorfuel-analytics-settings';
		$settings = array(
			'UA'  => array(
				'enabled' => false,
				'id' => ''
			),
			'verification' => array(
				'code' => ''
			),
			'AW' => array(
				'enabled' => false,
				'id' => ''
			),
			'conversions' => array(
				'phone' => array(
					'enabled' => false,
					'number' => '',
					'tag' => ''
				),
				'purchase' => array(
					'enabled' => false,
					'tag' => ''
				)
			)
		);
		$value = json_decode(wp_json_encode($settings), false);

		if (!get_option($option)) {
			add_option($option, $value);
		}
	}

	/**
	 * Sets or updates 'Anguledit' settings, which may include template map necessary for creating the necessary VendorFuel pages.
	 *
	 * @since 8.22.0
	 */
	private function set_anguledit_settings() {
		$option = 'vendorfuel-anguledit-settings';
		$settings = array('template_map' => array());
		$value = json_decode(wp_json_encode($settings), false);

		if (!get_option($option)) {
			add_option($option, $value);
		}
	}

	/**
	 * Sets or updates conversion settings.
	 *
	 * @since 8.22.0
	 */
	private function set_conversion_settings() {
		$option = 'vendorfuel-conversion-settings';
		$settings = array(
			'google' => array(
				'enabled'  => false,
				'id'       => '',
				'label'    => '',
				'tracking' => '',
			),
		);
		$value = json_decode(wp_json_encode($settings), false);

		if (!get_option($option)) {
			add_option($option, $value);
		}
	}

	/**
	 * Sets or updates general settings.
	 *
	 * @since 8.22.0
	 */
	private function set_general_settings() {
		$option = 'vendorfuel-general-settings';
		$general_settings = (array) get_option($option);
		$default_settings = array(
			'api_url'            => 'https://api.vendorfuel.com/production',
			'api_key'            => '',
			'product_slug'       => 'products',
			'cat_slug'           => 'categories',
			'requireAddress'     => 0,
			'debug'              => 0,
			'redirectToCart'     => 0,
			'pagination'         => 0,
			'enableRecyclable'   => 0,
			'checkout'           => array(
				'company_name_option'   => 0,
				'purchase_order_option' => 0,
				'issuing_office_option' => 0,
				'cost_center_option'    => 0,
				'attention_option'      => 0,
				'notes_option'          => 0,
			),
		);

		if (!$general_settings) {
			add_option($option, json_decode(wp_json_encode($default_settings), false));
		} else {
			if (isset($general_settings['apiKey'])) {
				$default_settings['api_key'] = $general_settings['apiKey'];
				unset($general_settings['apiKey']);
			}

			if (isset($general_settings['apiUrl'])) {
				$default_settings['api_url'] = $general_settings['apiUrl'];
				unset($general_settings['apiUrl']);
			}

			if (isset($general_settings['productSlug'])) {
				$default_settings['product_slug'] = $general_settings['productSlug'];
				unset($general_settings['productSlug']);
			}

			if (isset($general_settings['catSlug'])) {
				$default_settings['cat_slug'] = $general_settings['catSlug'];
				unset($general_settings['catSlug']);
			}

			update_option($option, json_decode(wp_json_encode(array_merge($default_settings, (array) $general_settings)), false));
		}
	}

	/**
	 * Sets or updates store settings.
	 *
	 * @since 8.22.0
	 */
	private function set_store_options() {
		$option = 'vendorfuel-store-options';
		$store_options = array(
			'name'    => '',
			'url'     => '',
			'options' => json_decode(
				wp_json_encode(
					array(
						'Inventory System'                => false,
						'Admin Two Factor Authentication' => false,
						'Verify Users'                    => false,
						'Disable Guests'                  => false,
						'Disable RMA'                     => false,
						'Disable Billing Address'         => false,
						'Force Role'                      => false,
						'Credit Line Default On'          => false,
					)
				),
				true
			),
		);
		$existing_store_options = get_option($option);

		if (!$existing_store_options) {
			add_option($option, json_decode(wp_json_encode($store_options), false));
		} else {
			update_option($option, json_decode(wp_json_encode(array_merge($store_options, (array) $existing_store_options)), false));
		}
	}
}
