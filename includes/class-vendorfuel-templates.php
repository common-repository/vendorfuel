<?php
class Vendorfuel_Templates {

	protected $utilities;

	public function __construct() {
		$this->utilities = Vendorfuel_Utilities::get_instance();

		if (!function_exists('WP_Filesystem')) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		WP_Filesystem();

		//custom posts for SEO/Frontend deployment
		add_action('the_post', array($this, 'vf_custom_post_types_remove_rss_feed'));

		//templates
		add_shortcode('vf-template', array($this, 'vendorfuel_template_shortcode'));
		add_action('permalink_structure_changed', array($this, 'permalink_template_map_update'));

		//yoast custom variable
		add_action('wpseo_register_extra_replacements', array($this, 'register_custom_yoast_variables'), 10, 0);

		//template map permalink updates
		add_action('save_post',  array($this,  'permalink_template_map_update'), 10, 1);

		//insert required helper component
		add_action(
			'wp_body_open',
			function () {
				echo '<vf-helper></vf-helper>';
			}
		);
	}

	private static $instance = null;

	public static function get_instance() {
		if (null === self::$instance) {
			self::$instance = new Vendorfuel_Templates();
		}
		return self::$instance;
	}



	public function shortcode($name) {
		return do_shortcode($this->utilities->get_template_content($name));
	}

	/**
	 * Processes vf template shortcode params and replaces content accordingly.
	 *
	 * @param array $params The params passed in from the shortcode
	 *
	 * @return string The html content of the template after params processed.
	 */
	public function vendorfuel_template_shortcode($params) {
		if (isset($params['name'])) {
			$content = $this->shortcode("{$params['name']}");

			if (isset($params['po_prefix'])) {
				return str_replace('PO_PREFIX', $params['po_prefix'], $content);
			}

			if (isset($params['product_id'])) {
				return str_replace('ID_OF_PRODUCT', $params['product_id'], $content);
			}

			if (isset($params['cat_id'])) {
				$content = str_replace('ID_OF_CATALOG', $params['cat_id'], $content);
				return str_replace('TYPE_OF_ID', 'CATEGORY', $content);
			}

			if (isset($params['collection_id'])) {
				$content = str_replace('ID_OF_CATALOG', $params['collection_id'], $content);
				return str_replace('TYPE_OF_ID', 'COLLECTION', $content);
			}

			if (isset($params['mfg_id'])) {
				$content = str_replace('ID_OF_CATALOG', $params['mfg_id'], $content);
				return str_replace('TYPE_OF_ID', 'MANUFACTURER', $content);
			}

			if (isset($params['customer_role'])) {
				return str_replace('CUSTOMER_ROLE', $params['customer_role'], $content);
			}

			return $content;
		}
		return '';
	}

	public function get_metadesc() {
		global $post;
		substr(get_post_meta($post->ID, 'vfmetadesc', true), 0, 155);
	}

	// define the action for register yoast_variable replacments
	public function register_custom_yoast_variables() {
		if (function_exists('wpseo_register_var_replacement')) {
			wpseo_register_var_replacement('%%vfmetadesc%%', array($this, 'get_metadesc'), 'advanced', 'VF Meta Description Field');
		}
	}

	public function vf_custom_post_types_remove_rss_feed() {
		if ('vf-product' === get_post_type() || 'vf-category' === get_post_type()) {
			remove_action('wp_head', 'feed_links_extra', 3);
			remove_action('wp_head', 'feed_links', 2);
		}
	}

	/**
	 * When permalinks setting is updated the template map urls will be updated.
	 *
	 */
	public function permalink_template_map_update() {
		//retrieve current anguledit settings where template_map is stored
		$anguledit_settings = get_option('vendorfuel-anguledit-settings');

		if (isset($anguledit_settings->template_map)) {
			foreach ($anguledit_settings->template_map as $slug => $template) {
				$template->url                             = get_permalink($template->id);
				$anguledit_settings->template_map->{$slug} = $template;
			}
			update_option('vendorfuel-anguledit-settings', $anguledit_settings);
		}
	}

	/**
	 * When a page/post is updated the template map will be searched for this post ID and url updated accordingly.
	 *
	 * @param integer $post_ID The ID of the post/page that was updated.
	 */
	public function update_template_map_links($post_ID) {
		//retrieve current anguledit settings where template_map is stored
		$anguledit_settings = get_option('vendorfuel-anguledit-settings');

		if (isset($anguledit_settings->template_map)) {
			//loop through template_map
			foreach ($anguledit_settings->template_map as $index => $template) {
				//match updated post ID with template_map post IDs
				if ($template->id === $post_ID) {
					//if matched
					//get new permalink of the updated post
					$template->url = get_permalink($post_ID);
					//store updated mapped template to template_map
					$anguledit_settings->template_map->{$index} = $template;
				}
			}
		}

		//persist updated template map
		update_option('vendorfuel-anguledit-settings', $anguledit_settings);
	}
}
