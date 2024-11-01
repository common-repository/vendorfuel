<?php
require_once 'class-vendorfuel-utilities.php';
require_once 'class-vendorfuel-enqueue.php';
require_once 'class-vendorfuel-admin-page.php';
require_once 'class-vendorfuel-initialize.php';
require_once 'class-vendorfuel-wprest-api.php';
require_once 'class-vendorfuel-templates.php';
require_once 'class-vendorfuel-queue.php';

/**
 * The core plugin class.
 *
 * @since 1.0.0
 *
 * @package    VendorFuel
 * @subpackage VendorFuel/includes
 */
class VendorFuel {

	private $templates;
	private $utilities;
	private $queue;

	public function __construct(string $file) {
		$this->templates = Vendorfuel_Templates::get_instance();
		$this->utilities = Vendorfuel_Utilities::get_instance();
		$this->queue     = Vendorfuel_Queue::get_instance();

		/**
		 * Admin assets
		 */
		add_action('admin_enqueue_scripts', array($this, 'vendorfuel_enqueue_plugin'));
		add_action('admin_init', array($this, 'vendorfuel_admin_init'));
		add_action('admin_menu', array($this, 'vendorfuel_admin_menu'));

		/**
		 * Frontend assets
		 */
		add_action('wp_enqueue_scripts', array($this, 'vendorfuel_enqueue_frontend'));

		add_action('rest_api_init', array($this, 'vendorfuel_custom_api'));

		if (defined('VENDORFUEL_BASENAME')) {
			add_filter('plugin_action_links_' . VENDORFUEL_BASENAME, array($this, 'vendorfuel_add_action_links'));
		}

		add_action('init', array($this, 'vendorfuel_setup_post_types'));
		register_activation_hook($file, array($this, 'vendorfuel_activate'));
		register_deactivation_hook($file, array($this, 'vendorfuel_deactivate'));
	}

	/**
	 * @since 8.22.0
	 */
	public function vendorfuel_activate() {
		$this->vendorfuel_setup_post_types();
		flush_rewrite_rules();
	}

	/**
	 * @since 8.21.0
	 */
	public function vendorfuel_add_action_links($actions) {
		$links = array(
			'<a href="' . admin_url('admin.php?page=vendorfuel#!/settings') . '">' . __('Settings', 'vendorfuel') . '</a>',
		);
		$actions = array_merge($links, $actions);
		return $actions;
	}

	public function vendorfuel_admin_menu() {
		$menu = new Vendorfuel_Admin_Page();
		$menu->register_menu();
	}

	public function vendorfuel_admin_init() {
		$vendorfuel = new Vendorfuel_Initialize();
		$vendorfuel->initialize();
	}

	public function vendorfuel_custom_api() {
		$rest_api = new Vendorfuel_WPRest_Api($this->utilities, $this->templates, $this->queue);
		$rest_api->register();
	}

	/**
	 * @since 8.22.0
	 */
	public function vendorfuel_deactivate() {
		unregister_post_type('vf-category');
		unregister_post_type('vf-product');
		flush_rewrite_rules();
	}

	public function vendorfuel_enqueue_frontend() {
		$assets = new Vendorfuel_Enqueue($this->utilities);
		$assets->frontend();
	}

	public function vendorfuel_enqueue_plugin($hook) {
		if ('toplevel_page_vendorfuel' === $hook) {
			$assets = new Vendorfuel_Enqueue($this->utilities);
			$assets->menu_page_assets($hook);
		} elseif (str_contains($hook, 'vendorfuel_page')) {
			$assets = new Vendorfuel_Enqueue($this->utilities);
			$assets->submenu_page_assets($hook);
		}
		return;
	}

	/**
	 * @since 8.22.0
	 */
	public function vendorfuel_setup_post_types() {
		$general_settings = get_option('vendorfuel-general-settings');
		$category_slug = (isset($general_settings->cat_slug) && '' !== $general_settings->cat_slug) ? $general_settings->cat_slug : 'categories';
		$product_slug = (isset($general_settings->product_slug) && '' !== $general_settings->product_slug) ? $general_settings->product_slug : 'products';

		register_post_type(
			'vf-product',
			array(
				'labels'          => array(
					'name'			=> __('VendorFuel Product Detail Pages'),
					'singular_name'	=> __('Product Detail Page'),
					'menu_name'		=> __('VF Product Detail Pages'),
				),
				'public'          => true,
				'has_archive'     => false,
				'rewrite'         => array('slug' => $product_slug),
				'supports'        => array('editor', 'title', 'custom-fields'),
				'show_in_rest'    => true,
				'capability_type' => 'post',
			)
		);

		register_post_type(
			'vf-category',
			array(
				'labels'          => array(
					'name'			=> __('VendorFuel Category Pages'),
					'singular_name'	=> __('Category Page'),
					'menu_name'		=> __('VF Category Pages'),
				),
				'public'          => true,
				'has_archive'     => false,
				'rewrite'         => array('slug' => $category_slug),
				'supports'        => array('editor', 'title', 'custom-fields'),
				'show_in_rest'    => true,
				'capability_type' => 'post',
			)
		);
	}
}
