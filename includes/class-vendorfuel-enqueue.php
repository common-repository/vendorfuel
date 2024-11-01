<?php
class Vendorfuel_Enqueue {

	private $general_settings;
	private $plugin_data;

	public function __construct() {
		$this->general_settings = get_option('vendorfuel-general-settings');
		if (is_admin()) {
			$this->plugin_data = get_plugin_data(VENDORFUEL_DIR_PATH . '/vendorfuel.php');
		}
	}

	/**
	 * Enqueue assets for menu page.
	 */
	public function menu_page_assets() {
		$filename = plugin_dir_path(__DIR__) . 'build/legacy.asset.php';

		if (file_exists($filename)) {
			$asset_file = require_once $filename;

			wp_enqueue_script(
				'vendorfuel-admin',
				plugin_dir_url(__DIR__) . 'build/legacy.js',
				$asset_file['dependencies'],
				$asset_file['version']
			);

			wp_enqueue_style(
				'vendorfuel-admin',
				plugin_dir_url(__DIR__) . 'build/legacy.css',
				array('wp-components'),
				$asset_file['version']
			);
		} else {
			wp_die("{$filename} not found.");
		}


		// Email Editor BEE Plugin
		wp_enqueue_script(
			'beefree',
			'//app-rsrc.getbee.io/plugin/BeePlugin.js',
			array(),
			'1.6.3' // Version based on NPM module @mailupinc/bee-plugin version number.
		);

		wp_enqueue_script(
			'beefree-blob',
			plugin_dir_url(__DIR__) . 'includes/lib/beefree/Blob.js',
			array('beefree'),
		);

		wp_enqueue_script(
			'beefree-filesaver',
			plugin_dir_url(__DIR__) . 'includes/lib/beefree/fileSaver.js',
			array('beefree'),
		);

		wp_enqueue_script(
			'tinymce-code',
			plugin_dir_url(__DIR__) . 'includes/lib/tinymce-code/plugin.min.js',
			array('wp-tinymce'),
			'4.9.11'
		);

		/**
		 * LOCALIZED VARIABLES
		 * These variables will be available to our AngularJS application
		 */
		wp_localize_script(
			'vendorfuel-admin',
			'localized',
			array(
				'apiURL' => VENDORFUEL_API_URL,
				'dir'         => array(
					'url'       => plugin_dir_url(__DIR__),
					'root'      => VENDORFUEL_DIR_PATH,
					'content'   => content_url() . '/vendorfuel/',
					'templates' => plugin_dir_url(__DIR__) . '/assets/app/templates/',
					'wpRestUrl' => get_rest_url(),
				),
				'settings'    => array(
					'general'    => $this->general_settings,
					'conversion' => get_option('vendorfuel-conversion-settings'),
					'store'      => get_option('vendorfuel-store-options'),
				),
				'nonce'       => wp_create_nonce('wp_rest'),
				'plugin_data' => $this->plugin_data
			)
		);
		wp_enqueue_media();
		wp_enqueue_editor();
	}

	/**
	 * Enqueues assets for submenu pages.
	 */
	public function submenu_page_assets($hook) {
		$apps = array(
			'accounting',
			'catalog',
			'customers',
			'punchout',
			'purchasing',
			'shipping',
			'signout',
			'users',
		);
		$submenu_page = str_replace('vendorfuel_page_vf-', '', $hook);
		$file = in_array($submenu_page, $apps) ? $submenu_page : 'admin';
		$filename = plugin_dir_path(__DIR__) . "build/{$file}.asset.php";

		if (file_exists($filename)) {
			$asset_file = require_once $filename;

			wp_enqueue_script(
				'vendorfuel-' . $submenu_page,
				plugin_dir_url(__DIR__) . "build/{$file}.js",
				$asset_file['dependencies'],
				$asset_file['version'],
				true
			);

			wp_enqueue_style(
				'vendorfuel-' . $submenu_page,
				plugin_dir_url(__DIR__) . 'build/admin.css',
				array('wp-components'),
				$asset_file['version'],
			);
		} else {
			wp_die("{$filename} not found.");
		}

		wp_localize_script(
			'vendorfuel-' . $submenu_page,
			'localized',
			array(
				'apiURL' => VENDORFUEL_API_URL,
				'dir'         	=> array(
					'url'       => plugin_dir_url(__DIR__),
					'root'      => VENDORFUEL_DIR_PATH,
					'content'   => content_url() . '/vendorfuel/',
					'templates' => plugin_dir_url(__DIR__) . '/assets/app/templates/',
					'wpRestUrl' => get_rest_url(),
				),
				'settings'    		=> array(
					'general'		=> $this->general_settings,
					'conversion'	=> get_option('vendorfuel-conversion-settings'),
					'store'     	=> get_option('vendorfuel-store-options'),
				),
				'nonce'				=> wp_create_nonce('wp_rest'),
				'plugin_data'		=> $this->plugin_data,
				'bloginfo'			=> array('name' => get_bloginfo('name'))
			)
		);
	}

	/**
	 * Enqueue assets for the front-end
	 */
	public function frontend() {
		$filename = plugin_dir_path(__DIR__) . 'build/public.asset.php';

		if (file_exists($filename)) {
			$asset_file = require_once $filename;

			wp_enqueue_script(
				'vendorfuel-public',
				plugin_dir_url(__DIR__) . 'build/public.js',
				$asset_file['dependencies'],
				$asset_file['version'],
				true
			);

			wp_enqueue_style(
				'vendorfuel-public',
				plugin_dir_url(__DIR__) . 'build/public.css',
				array(),
				$asset_file['version'],
			);
		} else {
			echo ("<script type='text/javascript'>console.error('VendorFuel error:', '{$filename} not found.')</script>");
		}


		//Google Analytics
		$analytics = json_decode(json_encode(get_option('vendorfuel-analytics-settings')), true);

		if (isset($analytics['UA']) && isset($analytics['UA']['id']) && $analytics['UA']['enabled']) {
			wp_enqueue_script(
				'vendorfuel-google-analytics',
				'https://www.googletagmanager.com/gtag/js?id=' . $analytics['UA']['id'],
			);
		}

		if (isset($analytics['verification']) && isset($analytics['verification']['code'])) {
			$google_verification_code = $analytics['verification']['code'];
			add_action(
				'wp_head',
				function () use ($google_verification_code) {
?>
				<meta name="google-site-verification" content="<?php echo esc_attr($google_verification_code); ?>" />
<?php
				}
			);
		}

		//Payment Gateways JS
		$enabled_payments = get_option('vendorfuel-enabled-payments');
		$paypal_client_id = get_option('vendorfuel-paypal-id');
		$stripe_enabled   = false;

		if (is_array($enabled_payments)) {

			if (array_key_exists('paypal', $enabled_payments) && array_key_exists('paypal_checkout_enabled', $enabled_payments['paypal']) && $enabled_payments['paypal']['paypal_checkout_enabled']) {
				if (null !== $paypal_client_id && '' !== $paypal_client_id) {
					wp_enqueue_script(
						'paypal-checkout',
						'https://www.paypal.com/sdk/js?currency=USD&client-id=' . $paypal_client_id,
						array(),
						null,
						true
					);
				}
			}

			if (array_key_exists('qualpay', $enabled_payments) && array_key_exists('enabled', $enabled_payments['qualpay']) && $enabled_payments['qualpay']['enabled']) {
				wp_enqueue_script(
					'qualpay-js',
					'https://app.qualpay.com/hosted/embedded/js/qp-embedded-sdk.min.js',
					array(),
					false,
					true
				);
				wp_enqueue_style(
					'qualpay-css',
					'https://app.qualpay.com/hosted/embedded/css/qp-embedded.css',
				);
			}

			if (array_key_exists('authnet', $enabled_payments) && array_key_exists('enabled', $enabled_payments['authnet']) && $enabled_payments['authnet']['enabled']) {
				//check sandbox?
				wp_enqueue_script(
					'accept-js',
					'https://js.authorize.net/v1/Accept.js',
					array(),
					null,
					true
				);
			}
			if (array_key_exists('stripe', $enabled_payments) && array_key_exists('enabled', $enabled_payments['stripe']) && $enabled_payments['stripe']['enabled']) {
				wp_enqueue_script(
					'stripe-js',
					'https://js.stripe.com/v3/',
					array(),
					'3',
					true
				);
				$stripe_enabled = true;
			}

			if (array_key_exists('squareup', $enabled_payments) && array_key_exists('enabled', $enabled_payments['squareup']) && $enabled_payments['squareup']['enabled']) {
				//check sandbox?
				wp_enqueue_script(
					'squareup-js',
					'https://js.squareup.com/v2/paymentform',
					array(),
					'2',
					true
				);
				wp_enqueue_style(
					'squareup-css',
					'https://api.vendorfuel.com/assets/lib/css/squareuppaymentform.css',
				);
			}
		}

		/**
		 * LOCALIZED VARIABLES
		 * These variables will be available to our AngularJS application
		 */
		$anguledit_settings = get_option('vendorfuel-anguledit-settings');
		wp_localize_script(
			'vendorfuel-public',
			'localized',
			array(
				'apiURL' => VENDORFUEL_API_URL,
				'dir'      => array(
					'url'       => plugin_dir_url(__DIR__),
					'root'      => VENDORFUEL_DIR_PATH,
					'content'   => content_url() . '/vendorfuel/',
					'wpRestUrl' => get_rest_url(),
				),
				'settings' => array(
					'general'            => $this->general_settings,
					'gateway'            => get_option('vendorfuel-gateway-settings'),
					'analytics'          => get_option('vendorfuel-analytics-settings'),
					'store'              => get_option('vendorfuel-store-options'),
					'stripe_pk'          => get_option('vendorfuel-stripe-pk'),
					'stripe_enabled'     => $stripe_enabled,
					'authnet_public_key' => get_option('vendorfuel-authnet-public-key'),
					'authnet_id'         => get_option('vendorfuel-authnet-id'),
					'square_location_id' => get_option('vendorfuel-square-location-id'),
				),
				'pages'    => $anguledit_settings->template_map,
			)
		);

		//Localize GET/POST parameters for punchout return
		wp_localize_script('vendorfuel-public', 'params', sanitize_post(array_merge($_GET, $_POST)));
	}
}
