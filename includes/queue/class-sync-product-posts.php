<?php
class Sync_Product_Posts extends WP_Background_Process {


	/**
	 * @var string
	 */
	protected $action = 'sync_products';


	/**
	 * Task
	 *
	 * Override this method to perform any actions required on each
	 * queue item. Return the modified item for further processing
	 * in the next pass through. Or, return false to remove the
	 * item from the queue.
	 *
	 * @param mixed $item Queue item to iterate over
	 *
	 * @return mixed
	 */
	private $tokena   = null;
	private $tokenb   = null;
	private $endpoint = VENDORFUEL_API_URL
		. '/admin/products/seo'
		. '?apikey=' . VENDORFUEL_API_KEY;

	private $total_pages = 1;

	private $page = null;

	protected function task($item) {
		// Actions to perform
		$this->page    = $item['page'];
		$this->tokena  = $item['tokena'];
		$this->tokenb  = $item['tokenb'];
		$this->id      = ($item['id']) ? $item['id'] : '';
		$this->started = $item['started'];

		if (is_null($this->tokena) && is_null($this->tokenb)) {
			return false;
		}

		$this->log('retrieving page : ' . $this->page);
		$this->retrieveProducts($this->page, $this->id);
		return false;
	}

	/**
	 * Complete
	 *
	 * Override if applicable, but ensure that the below actions are
	 * performed, or, call parent::complete().
	 */
	protected function complete() {
		parent::complete();
		$this->log('completing page : ' . $this->page);

		if ($this->page < $this->total_pages) {
			$item['page']    = $this->page + 1;
			$item['tokena']  = $this->tokena;
			$item['tokenb']  = $this->tokenb;
			$item['started'] = $this->started;

			$this->push_to_queue($item);
			$this->save()->dispatch();
		} else {
			$this->log('completed syncing product posts');
			if ('' === $this->id || null === $this->id) {
				$this->clearProductPosts();
			}
		}
	}

	protected function clearProductPosts() {
		global $wpdb;
		$post_table = $wpdb->posts;
		$result = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$post_table} WHERE post_type = 'vf-product' AND post_modified < %s", array($this->started)), OBJECT); //phpcs:ignore
		while ($result) {
			$this->log('clearing out dated posts:');

			foreach ($result as $post) {
				$post_id = $post->ID;
				wp_delete_post($post_id, true);
			}

			$result = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$post_table} WHERE post_type = 'vf-product' AND post_modified < %s", array($this->started)), OBJECT); //phpcs:ignore
		}
	}

	protected function retrieveProducts($page, $id) {
		$this->endpoint .= '&tokena='
			. $this->tokena
			. '&tokenb=' . $this->tokenb
			. '&rpp=500'
			. '&id=' . $id
			. '&page=' . $page;

		$response = wp_remote_get(
			$this->endpoint,
			array(
				'sslverify' => false,
				'timeout'   => 120,
			)
		);

		if (is_wp_error($response)) {
			$this->log($response->get_error_message());
		}

		$body = wp_remote_retrieve_body($response);
		if (is_wp_error($body)) {
			$this->log($body->get_error_message());
			return;
		}

		$response = json_decode($body);
		if (!isset($response->products)) {
			return $this->retrieveProducts($page, $id);
		}
		$products          = $response->products;
		$this->total_pages = $products->last_page;

		foreach ($products->data as $product) {
			$slug             = sanitize_text_field($product->slug);
			$product_id       = $product->product_id;
			$content          = '
				<!-- wp:shortcode -->
				[vf-template name="product-detail" product_id="' . $product_id . '"]
				<!-- /wp:shortcode -->';
			$meta_title       = null;
			$meta_description = null;

			if ($product->meta && null !== $product->meta->description) {
				$meta_description = sanitize_text_field($product->meta->description);
			} elseif ($product->long_description && null !== $product->long_description) {
				$meta_description = sanitize_text_field($product->long_description);
			}

			if ($product->meta && null !== $product->meta->title) {
				$meta_title = sanitize_text_field($product->meta->title);
			} elseif ($product->description && null !== $product->description) {
				$meta_title = sanitize_text_field($product->description);
			}

			$post = array(
				'post_type'    => 'vf-product',
				'post_title'   => sanitize_text_field($product->description),
				'post_name'    => $slug,
				'post_status'  => 'publish',
				'post_content' => $content,
			);
			global $wpdb;
			$posts_table = $wpdb->posts;
			$result = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$posts_table} WHERE post_type = 'vf-product' AND post_content LIKE %s", array("%product_id='{$product_id}'%")), OBJECT); //phpcs:ignore

			if ($result) {
				$this->log('found existings posts for product id: ' . $product->product_id);

				$post_id    = $result[0]->ID;
				$post['ID'] = $post_id;
				$post['post_content'] = $result[0]->post_content;
				wp_update_post($post);
				$this->log('Updating post for product id: ' . $post_id . ' ' . $product->product_id);

				if ($meta_description) {
					update_post_meta($post_id, 'vfmetadesc', substr($meta_description, 0, 160));
					update_post_meta($post_id, '_yoast_wpseo_metadesc', '%%cf_vfmetadesc%%');
				}

				if ($meta_title) {
					update_post_meta($post_id, '_yoast_wpseo_title', substr($meta_title, 0, 160));
				}

				$count = count($result);
				if ($count > 1) {
					$this->log('found duplicate posts for product id: ' . $product->product_id);

					for ($i = 1; $i < $count; $i++) {
						$this->log('delete duplicate post for product id: ' . $product->product_id);
						$post_id = $result[$i]->ID;
						wp_delete_post($post_id);
					}
				}
			} else {
				$post_id = wp_insert_post($post);
				$this->log('Inserting post for product id: ' . $post_id . ' ' . $product->product_id);
				if ($meta_description) {
					add_post_meta($post_id, 'vfmetadesc', substr($meta_description, 0, 155), true);
					add_post_meta($post_id, '_yoast_wpseo_metadesc', '%%cf_vfmetadesc%%', true);
				}

				if ($meta_title) {
					add_post_meta($post_id, '_yoast_wpseo_title', substr($meta_title, 0, 160), true);
				}
			}
		}

		$this->total_pages = $products->last_page;
	}
}
