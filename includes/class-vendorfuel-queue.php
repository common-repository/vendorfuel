<?php
require_once plugin_dir_path( __FILE__ ) . 'queue/class-wp-async-request.php';
require_once plugin_dir_path( __FILE__ ) . 'queue/class-wp-background-process.php';
require_once plugin_dir_path( __FILE__ ) . 'queue/class-sync-product-posts.php';
require_once plugin_dir_path( __FILE__ ) . 'queue/class-sync-category-posts.php';

class Vendorfuel_Queue {

	private static $instance      = null;
	public $products_posts_sync   = null;
	public $categories_posts_sync = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new Vendorfuel_Queue();
		}
		return self::$instance;
	}

	public function __construct() {
		$this->products_posts_sync   = new Sync_Product_Posts();
		$this->categories_posts_sync = new Sync_Category_Posts();
	}

}
