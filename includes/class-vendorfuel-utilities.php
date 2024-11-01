<?php
class Vendorfuel_Utilities {

	private static $instance = null;
	public function __construct() {
		if (!function_exists('WP_Filesystem')) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		WP_Filesystem();
	}
	public static function get_instance() {
		if (null === self::$instance) {
			self::$instance = new Vendorfuel_Utilities();
		}
		return self::$instance;
	}
	public function build_readable_route($context, $callback) {
		//build a readable rest route
		return array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => array($context, $callback),
			'permission_callback' => array($context, 'permission_check'),
			'args'                => $context->get_endpoint_args_for_item_schema(false),
		);
	}
	public function build_editable_route($context, $callback) {
		//build an editable rest route
		return array(
			'methods'             => WP_REST_Server::EDITABLE,
			'callback'            => array($context, $callback),
			'permission_callback' => array($context, 'permission_check'),
			'args'                => $context->get_endpoint_args_for_item_schema(false),
		);
	}
	public function build_delete_route($context, $callback) {
		//build an DELETABLE rest route
		return array(
			'methods'             => WP_REST_Server::DELETABLE,
			'callback'            => array($context, $callback),
			'permission_callback' => array($context, 'permission_check'),
			'args'                => $context->get_endpoint_args_for_item_schema(WP_REST_Server::DELETABLE),
		);
	}

	public function get_template_content($name) {
		global $wp_filesystem;

		$file = plugin_dir_path(__DIR__) . "includes/templates/{$name}.html";

		if (file_exists($file)) {
			return $wp_filesystem->get_contents($file);
		} else {
			return "<p>{$file} not found.</p>";
		}
	}
}
