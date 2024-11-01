<?php
class Vendorfuel_WPRest_Api extends WP_REST_Controller {

	protected $templates;
	protected $utilities;
	protected $queue;

	public function __construct($utilities, $templates, $queue) {
		$this->templates = $templates;
		$this->utilities = $utilities;
		$this->queue     = $queue;
	}

	public function register() {
		//register routes
		register_rest_route(
			'vendorfuel',
			'/settings/general',
			array(
				$this->utilities->build_readable_route($this, 'getGeneralSettings'),
				$this->utilities->build_editable_route($this, 'updateGeneralSettings'),
			)
		);
		register_rest_route(
			'vendorfuel',
			'/wp/site/info',
			array(
				$this->utilities->build_readable_route($this, 'getWPSiteInfo'),
			)
		);
		register_rest_route(
			'vendorfuel',
			'/vendorfuel/pages',
			array(
				$this->utilities->build_readable_route($this, 'getVendorfuelPages'),
				$this->utilities->build_editable_route($this, 'updateVendorfuelPages'),
			)
		);
		register_rest_route(
			'vendorfuel',
			'/settings/analytics',
			array(
				$this->utilities->build_readable_route($this, 'getAnalyticsSettings'),
				$this->utilities->build_editable_route($this, 'updateAnalyticsSettings'),
			)
		);
		register_rest_route(
			'vendorfuel',
			'/settings/image',
			array(
				$this->utilities->build_readable_route($this, 'getImageSettings'),
				$this->utilities->build_editable_route($this, 'updateImageSettings'),
			)
		);
		register_rest_route(
			'vendorfuel',
			'/settings/anguledit',
			array(
				$this->utilities->build_readable_route($this, 'getAnguleditSettings'),
				$this->utilities->build_editable_route($this, 'updateAnguleditSettings'),
			)
		);
		register_rest_route(
			'vendorfuel',
			'/settings/paypal',
			array(
				$this->utilities->build_readable_route($this, 'getPayPalId'),
				$this->utilities->build_editable_route($this, 'setPayPalId'),
				$this->utilities->build_delete_route($this, 'clearPayPalId'),
			)
		);

		register_rest_route(
			'vendorfuel',
			'/payment/enabled',
			array(
				$this->utilities->build_readable_route($this, 'getEnabledPayments'),
				$this->utilities->build_editable_route($this, 'setEnabledPayments'),
			)
		);

		register_rest_route(
			'vendorfuel',
			'/settings/stripe',
			array(
				$this->utilities->build_readable_route($this, 'getStripePK'),
				$this->utilities->build_editable_route($this, 'setStripePK'),
				$this->utilities->build_delete_route($this, 'clearStripePK'),
			)
		);
		register_rest_route(
			'vendorfuel',
			'/settings/authnet',
			array(
				$this->utilities->build_editable_route($this, 'setAuthnetCreds'),
				$this->utilities->build_delete_route($this, 'clearAuthnetCreds'),
			)
		);
		register_rest_route(
			'vendorfuel',
			'/settings/squareup',
			array(
				$this->utilities->build_readable_route($this, 'getSquareUp'),
				$this->utilities->build_editable_route($this, 'setSquareUp'),
			)
		);
		register_rest_route(
			'vendorfuel',
			'/settings/store',
			array(
				$this->utilities->build_readable_route($this, 'getStoreOptions'),
				$this->utilities->build_editable_route($this, 'setStoreOptions'),
			)
		);

		register_rest_route(
			'vendorfuel',
			'/syncProductPosts',
			array(
				$this->utilities->build_readable_route($this, 'sync_product_posts'),
			)
		);

		register_rest_route(
			'vendorfuel',
			'/syncCategoryPosts',
			array(
				$this->utilities->build_readable_route($this, 'sync_category_posts'),
			)
		);

		register_rest_route(
			'vendorfuel',
			'sync',
			array(
				array(
					'methods'       => WP_REST_Server::READABLE,
					'callback'      => array($this, 'get_sync_status'),
					'show_in_index' => false
				),
				array(
					'methods'       => WP_REST_Server::DELETABLE,
					'callback'      => array($this, 'destroy_sync_status'),
					'show_in_index' => false
				)
			)
		);
	}

	public function sync_product_posts(WP_REST_Request $request) {
		$this->clear_sync_options('products');

		$param           = array();
		$param['page']   = 1;
		$param['tokena'] = $request->get_header('tokena');
		$param['tokenb'] = $request->get_header('tokenb');
		$param['id']     = ($request['id']) ? $request['id'] : '';

		$param['started'] = current_datetime()->format('Y-m-d H:i:s');

		$this->queue->products_posts_sync->push_to_queue($param);
		$this->queue->products_posts_sync->save()->dispatch();

		$response                  = array();
		$response['notifications'] = array('Product data is now syncing to VendorFuel product detail pages.');
		$response['errors']        = array();
		return $response;
	}

	public function sync_category_posts(WP_REST_Request $request) {
		$this->clear_sync_options('categories');

		$param           = array();
		$param['page']   = 1;
		$param['tokena'] = $request->get_header('tokena');
		$param['tokenb'] = $request->get_header('tokenb');
		$param['id']     = ($request['id']) ? $request['id'] : '';

		$param['started'] = current_datetime()->format('Y-m-d H:i:s');;

		$this->queue->categories_posts_sync->push_to_queue($param);
		$this->queue->categories_posts_sync->save()->dispatch();

		$response                  = array();
		$response['notifications'] = array('Category data is now syncing to VF Category Posts.');
		$response['errors']        = array();
		return $response;
	}

	/**
	 * Clears rows from wp_options table that can persist if the WordPress queue gets stuck, thus preventing any further synching.
	 */
	private function clear_sync_options(string $type) {
		global $wpdb;

		if ($type === 'categories') {
			$query = "DELETE FROM $wpdb->options WHERE option_name LIKE 'wp_sync_categories%'";
		} else {
			$query = "DELETE FROM $wpdb->options WHERE option_name LIKE 'wp_sync_products%'";
		}
		$wpdb->query($wpdb->prepare($query));

		return $type;
	}

	public function getWPSiteInfo() {
		$wp_name = get_bloginfo();
		$url     = get_bloginfo('wpurl');
		$info    = array(
			'name' => $wp_name,
			'url'  => $url,
		);
		return rest_ensure_response(json_decode(wp_json_encode($info), true));
	}

	public function getStoreOptions() {
		return rest_ensure_response(get_option('vendorfuel-store-options'));
	}

	public function setStoreOptions(WP_REST_Request $request) {
		$store = array_merge(
			array('name' => $request['name']),
			array('url' => $request['url']),
			array('default_order_prefix' => $request['default_order_prefix']),
			array('default_customer_prefix' => $request['default_customer_prefix']),
			array('options' => json_decode($request['options'], true))
		);
		return rest_ensure_response(update_option('vendorfuel-store-options', json_decode(wp_json_encode($store), false)));
	}

	//ENDPOINT CALLBACKS
	public function getGeneralSettings() {
		return rest_ensure_response(get_option('vendorfuel-general-settings'));
	}

	public function updateGeneralSettings(WP_REST_Request $request) {
		$settings = json_decode($request['settings']);
		if (update_option('vendorfuel-general-settings', $settings)) {
			return rest_ensure_response(true);
		}
		return rest_ensure_response(false);
	}

	public function getVendorfuelPages() {
		$anguledit_settings = get_option('vendorfuel-anguledit-settings');
		$vf_pages           = $anguledit_settings->template_map;

		$wp_pages = array();
		$pages    = array_merge(
			get_posts(
				array(
					'posts_per_page' => -1,
				)
			),
			get_pages()
		);
		$count    = count($pages);
		for ($i = 0; $i < $count; $i++) {
			$wp_pages[$i]['url']   = get_permalink($pages[$i]);
			$wp_pages[$i]['id']    = $pages[$i]->ID;
			$wp_pages[$i]['title'] = $pages[$i]->post_title;
		}
		$all_pages = array($vf_pages, $wp_pages);
		return rest_ensure_response($all_pages);
	}

	public function updateVendorfuelPages(WP_REST_Request $request) {
		$settings       = json_decode($request['map']);
		$vf_page_update = array();

		foreach ($settings as $page => $val) {
			$vf_page_update[$page] = array(
				'id'       => $val->id,
				'url'      => $val->url,
				'title'    => $val->title,
				'template' => $val->template,
			);
		}
		foreach ($vf_page_update as $key => $page) {
			$page['url'] = esc_url_raw($page['url']);
			if (filter_var($page['url'], FILTER_VALIDATE_URL) === false) {
				unset($vf_page_update[$key]);
			} else {
				$vf_page_update[$key] = $page;
			}
		}
		$anguledit_settings               = get_option('vendorfuel-anguledit-settings');
		$anguledit_settings->template_map = json_decode(wp_json_encode($vf_page_update), false);
		return rest_ensure_response(update_option('vendorfuel-anguledit-settings', $anguledit_settings));
	}

	public function getAnalyticsSettings() {
		return rest_ensure_response(get_option('vendorfuel-analytics-settings'));
	}

	public function updateAnalyticsSettings(WP_REST_Request $request) {
		$settings = json_decode($request['settings']);
		return rest_ensure_response(update_option('vendorfuel-analytics-settings', $settings));
	}

	public function getImageSettings() {
		return rest_ensure_response(get_option('vendorfuel-image-settings'));
	}

	public function updateImageSettings(WP_REST_Request $request) {
		$settings = json_decode($request['settings']);
		return rest_ensure_response(update_option('vendorfuel-image-settings', $settings));
	}

	public function getAnguleditSettings() {
		return rest_ensure_response(get_option('vendorfuel-anguledit-settings'));
	}

	public function updateAnguleditSettings(WP_REST_Request $request) {
		$settings               = json_decode($request['settings']);
		return array(
			'settings_saved'         => rest_ensure_response(update_option('vendorfuel-anguledit-settings', $settings)),
		);
	}

	public function getPayPalId() {
		return rest_ensure_response(get_option('vendorfuel-paypal-id'));
	}

	public function setPayPalId(WP_REST_Request $request) {
		$id = $request['paypal_client_id'];
		update_option('vendorfuel-paypal-id', $id);
		$response                  = array();
		$response['notifications'] = array('Payment Gateways Updated.');
		$response['errors']        = array();
		return $response;
	}

	public function clearPayPalId(WP_REST_Request $request) {
		update_option('vendorfuel-paypal-id', '');

		$response                  = array();
		$response['notifications'] = array('Payment Gateways Updated.');
		$response['errors']        = array();
		return $response;
	}

	public function setAuthnetCreds(WP_REST_Request $request) {
		$id  = $request['id'];
		$key = $request['public_key'];
		update_option('vendorfuel-authnet-id', $id);
		update_option('vendorfuel-authnet-public-key', $key);

		$response                  = array();
		$response['notifications'] = array('Payment Gateways Updated.');
		$response['errors']        = array();
		return $response;
	}

	public function clearAuthnetCreds() {
		update_option('vendorfuel-authnet-id', '');
		update_option('vendorfuel-authnet-public-key', '');

		$response                  = array();
		$response['notifications'] = array('Payment Gateways Cleared.');
		$response['errors']        = array();
		return $response;
	}

	public function getStripePK() {
		return rest_ensure_response(get_option('vendorfuel-stripe-pk'));
	}

	public function setStripePK(WP_REST_Request $request) {
		$id = $request['stripe_pk'];
		update_option('vendorfuel-stripe-pk', $id);
		$response                  = array();
		$response['notifications'] = array('Payment Gateways Updated.');
		$response['errors']        = array();
		return $response;
	}

	public function clearStripePK() {
		update_option('vendorfuel-stripe-pk', '');
		$response                  = array();
		$response['notifications'] = array('Payment Gateways Updated.');
		$response['errors']        = array();
		return $response;
	}

	public function getEnabledPayments() {
		return rest_ensure_response(get_option('vendorfuel-enabled-payments'));
	}

	public function setEnabledPayments(WP_REST_Request $request) {
		$gateway          = $request['gateway'];
		$existing_enabled = get_option('vendorfuel-enabled-payments');
		foreach ($gateway as $key => $value) {
			foreach ($value as $k => $v) {
				if ('enabled' !== $k && 'paypal_checkout_enabled' !== $k) {
					unset($gateway[$key][$k]);
				} else {
					if ('enabled' === $k) {
						foreach ($existing_enabled as $k2 => $v2) {
							$existing_enabled[$k2]['enabled'] = 0;
						}
					}
				}
			}
		}
		if (!$existing_enabled) {
			$existing_enabled = array();
		}
		$merged = array_merge($existing_enabled, $gateway);
		update_option('vendorfuel-enabled-payments', $merged);

		$response                  = array();
		$response['notifications'] = array('Payment Gateways Updated.');
		$response['errors']        = array();
		return $response;
	}

	public function getSquareUp() {
		return rest_ensure_response(get_option('vendorfuel-square-location-id'));
	}

	public function setSquareUp(WP_REST_Request $request) {
		$id = $request['location_id'];
		update_option('vendorfuel-square-location-id', $id);
		$response                  = array();
		$response['notifications'] = array('Payment Gateways Updated.');
		$response['errors']        = array();
		return $response;
	}

	public function permission_check(WP_REST_Request $request) {
		//ensure only authorized access to editable routes
		if (is_user_logged_in()) {
			$headers = $request->get_headers();
			$nonce   = $headers['x_wp_nonce'][0];
			if (wp_verify_nonce($nonce, 'wp_rest')) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public function get_sync_status() {
		$categories_option = get_option('wp_sync_categories_process_lock');
		$product_option = get_option('wp_sync_products_process_lock');

		if (empty($categories_option) && empty($product_option)) {
			return 'WordPress is not synchronizing product categories or pages with VendorFuel.';
		} else if ($categories_option || $product_option)
			return 'WordPress is currently synchronizing product categories or pages with VendorFuel.';
	}

	public function destroy_sync_status() {
		global $wpdb;
		$count = $wpdb->get_var(
			"SELECT COUNT(*) FROM $wpdb->options WHERE option_name LIKE 'wp_sync%'"
		);

		if ($count > 0) {
			$wpdb->query($wpdb->prepare(
				"DELETE FROM $wpdb->options WHERE (option_name LIKE 'wp_sync_categories%' OR option_name LIKE 'wp_sync_products%')"
			));
			return 'Database unlocked from synchronizing VendorFuel categories and products.';
		}
		return 'Database is not currently locked.';
	}
}
